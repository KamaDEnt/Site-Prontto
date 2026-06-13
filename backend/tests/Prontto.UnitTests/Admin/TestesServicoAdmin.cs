using FluentAssertions;
using Microsoft.Extensions.Caching.Memory;
using Moq;
using Prontto.Application.Admin;
using Prontto.Application.Common;
using Prontto.Domain.Entities;
using Prontto.Domain.Enums;
using Prontto.Domain.Interfaces;

namespace Prontto.UnitTests.Admin;

public class TestesServicoAdmin
{
    private readonly Mock<IRepositorioUsuario> _repositorioUsuarios = new();
    private readonly Mock<IRepositorioServico> _repositorioServicos = new();
    private readonly Mock<IRepositorioCobranca> _repositorioCobrancas = new();
    private readonly Mock<IRepositorioMensagem> _repositorioMensagens = new();
    private readonly Mock<IRepositorioAuditLog> _repositorioAuditLog = new();
    private readonly IMemoryCache _cache = new MemoryCache(new MemoryCacheOptions());
    private readonly ServicoAdmin _sut;

    public TestesServicoAdmin()
    {
        _repositorioAuditLog.Setup(r => r.RegistrarAsync(It.IsAny<AuditLog>())).Returns(Task.CompletedTask);

        _sut = new ServicoAdmin(
            _repositorioUsuarios.Object,
            _repositorioServicos.Object,
            _repositorioCobrancas.Object,
            _repositorioMensagens.Object,
            _repositorioAuditLog.Object,
            _cache);
    }

    [Fact]
    public async Task AtualizarStatusServicoAsync_ParaConcluido_CriaCobranca()
    {
        var idServico = Guid.NewGuid();
        var servico = new Servico
        {
            Id = idServico, Preco = 100m, TaxaAdminRate = 0.2m,
            Status = StatusServico.EmAndamento
        };

        _repositorioServicos.Setup(r => r.ObterPorIdAsync(idServico)).ReturnsAsync(servico);
        _repositorioCobrancas.Setup(r => r.ExistePorServicoAsync(idServico)).ReturnsAsync(false);
        _repositorioCobrancas.Setup(r => r.AdicionarAsync(It.IsAny<Cobranca>())).ReturnsAsync((Cobranca c) => c);
        _repositorioServicos.Setup(r => r.AtualizarAsync(It.IsAny<Servico>())).ReturnsAsync((Servico s) => s);

        var resultado = await _sut.AtualizarStatusServicoAsync(idServico, StatusServico.Concluido);

        resultado.Status.Should().Be(StatusServico.Concluido);
        resultado.ConcluidoEm.Should().NotBeNull();
        _repositorioCobrancas.Verify(r => r.AdicionarAsync(It.Is<Cobranca>(c =>
            c.TaxaAdmin == 20m &&
            c.ValorPrestador == 80m &&
            c.ValorTotal == 100m &&
            c.Status == StatusCobranca.Pago
        )), Times.Once);
    }

    [Fact]
    public async Task AtualizarStatusServicoAsync_ParaConcluido_NaoDuplicaCobranca()
    {
        var idServico = Guid.NewGuid();
        var servico = new Servico { Id = idServico, Preco = 100m, TaxaAdminRate = 0.2m };
        _repositorioServicos.Setup(r => r.ObterPorIdAsync(idServico)).ReturnsAsync(servico);
        _repositorioCobrancas.Setup(r => r.ExistePorServicoAsync(idServico)).ReturnsAsync(true);
        _repositorioServicos.Setup(r => r.AtualizarAsync(It.IsAny<Servico>())).ReturnsAsync(servico);

        await _sut.AtualizarStatusServicoAsync(idServico, StatusServico.Concluido);

        _repositorioCobrancas.Verify(r => r.AdicionarAsync(It.IsAny<Cobranca>()), Times.Never);
    }

    [Fact]
    public async Task AtualizarStatusServicoAsync_NaoEncontrado_LancaExcecaoNaoEncontrado()
    {
        _repositorioServicos.Setup(r => r.ObterPorIdAsync(It.IsAny<Guid>())).ReturnsAsync((Servico?)null);

        await _sut.Invoking(s => s.AtualizarStatusServicoAsync(Guid.NewGuid(), StatusServico.Cancelado))
            .Should().ThrowAsync<ExcecaoNaoEncontrado>();
    }

    [Fact]
    public async Task EnviarMensagemAsync_ConteudoVazio_LancaExcecaoValidacao()
    {
        await _sut.Invoking(s => s.EnviarMensagemAsync(Guid.NewGuid(), Guid.NewGuid(), "   "))
            .Should().ThrowAsync<ExcecaoValidacao>();
    }

    [Fact]
    public async Task ObterEstatisticasAsync_RetornaAgregacaoCorreta()
    {
        _repositorioUsuarios.Setup(r => r.ListarNaoAdminsAsync()).ReturnsAsync([
            new Usuario { TipoConta = TipoConta.Cliente },
            new Usuario { TipoConta = TipoConta.Prestador },
        ]);
        _repositorioServicos.Setup(r => r.ContarTodosAsync()).ReturnsAsync(5);
        _repositorioServicos.Setup(r => r.ContarPorStatusAsync(StatusServico.EmNegociacao)).ReturnsAsync(2);
        _repositorioServicos.Setup(r => r.ContarPorStatusAsync(StatusServico.EmAndamento)).ReturnsAsync(1);
        _repositorioServicos.Setup(r => r.ContarPorStatusAsync(StatusServico.Concluido)).ReturnsAsync(2);
        _repositorioCobrancas.Setup(r => r.SomarTaxaAdminPorStatusAsync(StatusCobranca.Pago)).ReturnsAsync(40m);
        _repositorioCobrancas.Setup(r => r.SomarTaxaAdminPorStatusAsync(StatusCobranca.Pendente)).ReturnsAsync(0m);
        _repositorioCobrancas.Setup(r => r.SomarValorTotalPorStatusAsync(StatusCobranca.Pago)).ReturnsAsync(200m);

        var stats = await _sut.ObterEstatisticasAsync();

        stats.Usuarios.Total.Should().Be(2);
        stats.Usuarios.Clientes.Should().Be(1);
        stats.Usuarios.Prestadores.Should().Be(1);
        stats.Servicos.Total.Should().Be(5);
        stats.Receita.Ganha.Should().Be(40m);
        stats.Receita.Gmv.Should().Be(200m);
    }
}
