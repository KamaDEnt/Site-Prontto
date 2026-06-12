using FluentAssertions;
using Moq;
using Prontto.Application.Common;
using Prontto.Application.Financeiro;
using Prontto.Application.Servicos;
using Prontto.Domain.Entities;
using Prontto.Domain.Enums;
using Prontto.Domain.Interfaces;

namespace Prontto.UnitTests.Servicos;

public class TestesServicoNegociacao
{
    private readonly Mock<IRepositorioServico> _repositorioServicos = new();
    private readonly Mock<IRepositorioMensagem> _repositorioMensagens = new();
    private readonly Mock<IRepositorioCobranca> _repositorioCobrancas = new();
    private readonly Mock<IRepositorioNotificacao> _repositorioNotificacoes = new();
    private readonly Mock<IRepositorioAuditLog> _repositorioAuditLog = new();
    private readonly Mock<IServicoFinanceiro> _servicoFinanceiro = new();
    private readonly ServicoNegociacao _sut;

    public TestesServicoNegociacao()
    {
        _sut = new ServicoNegociacao(
            _repositorioServicos.Object,
            _repositorioMensagens.Object,
            _repositorioCobrancas.Object,
            _repositorioNotificacoes.Object,
            _repositorioAuditLog.Object,
            _servicoFinanceiro.Object);
    }

    // ── EnviarPropostaAsync ────────────────────────────────────────────────────

    [Fact]
    public async Task EnviarPropostaAsync_ValorZero_LancaExcecaoValidacao()
    {
        var servicoId = Guid.NewGuid();
        var prestadorId = Guid.NewGuid();
        var servico = CriarServico(servicoId, prestadorId: prestadorId);
        _repositorioServicos.Setup(r => r.ObterPorIdAsync(servicoId)).ReturnsAsync(servico);

        await _sut.Invoking(s => s.EnviarPropostaAsync(servicoId, prestadorId, PapelRemetente.Prestador, 0m))
            .Should().ThrowAsync<ExcecaoValidacao>();
    }

    [Fact]
    public async Task EnviarPropostaAsync_StatusNaoEmNegociacao_LancaExcecaoTransicaoInvalida()
    {
        var servicoId = Guid.NewGuid();
        var prestadorId = Guid.NewGuid();
        var servico = CriarServico(servicoId, prestadorId: prestadorId, status: StatusServico.EmAndamento);
        _repositorioServicos.Setup(r => r.ObterPorIdAsync(servicoId)).ReturnsAsync(servico);

        await _sut.Invoking(s => s.EnviarPropostaAsync(servicoId, prestadorId, PapelRemetente.Prestador, 100m))
            .Should().ThrowAsync<ExcecaoTransicaoInvalida>();
    }

    [Fact]
    public async Task EnviarPropostaAsync_EmDisputa_LancaExcecaoTransicaoInvalida()
    {
        var servicoId = Guid.NewGuid();
        var prestadorId = Guid.NewGuid();
        var servico = CriarServico(servicoId, prestadorId: prestadorId, status: StatusServico.EmDisputa);
        _repositorioServicos.Setup(r => r.ObterPorIdAsync(servicoId)).ReturnsAsync(servico);

        await _sut.Invoking(s => s.EnviarPropostaAsync(servicoId, prestadorId, PapelRemetente.Prestador, 100m))
            .Should().ThrowAsync<ExcecaoTransicaoInvalida>();
    }

    [Fact]
    public async Task EnviarPropostaAsync_ComPropostaPendente_ExpiraAnteriorECriaNova()
    {
        var servicoId = Guid.NewGuid();
        var prestadorId = Guid.NewGuid();
        var servico = CriarServico(servicoId, prestadorId: prestadorId);

        var propostaAnterior = new MensagemServico
        {
            Id = Guid.NewGuid(), ServicoId = servicoId,
            TipoMensagem = TipoMensagem.Proposta,
            StatusProposta = StatusProposta.Pendente,
            ValorProposta = 50m
        };

        _repositorioServicos.Setup(r => r.ObterPorIdAsync(servicoId)).ReturnsAsync(servico);
        _repositorioMensagens.Setup(r => r.ObterPropostaPendenteAsync(servicoId)).ReturnsAsync(propostaAnterior);
        _repositorioMensagens.Setup(r => r.AtualizarAsync(It.IsAny<MensagemServico>())).Returns(Task.CompletedTask);
        _repositorioMensagens.Setup(r => r.AdicionarAsync(It.IsAny<MensagemServico>())).ReturnsAsync((MensagemServico m) => m);
        _repositorioNotificacoes.Setup(r => r.AdicionarAsync(It.IsAny<Notificacao>())).Returns(Task.CompletedTask);

        await _sut.EnviarPropostaAsync(servicoId, prestadorId, PapelRemetente.Prestador, 100m);

        _repositorioMensagens.Verify(r => r.AtualizarAsync(
            It.Is<MensagemServico>(m => m.StatusProposta == StatusProposta.Expirada)
        ), Times.Once);

        _repositorioMensagens.Verify(r => r.AdicionarAsync(
            It.Is<MensagemServico>(m =>
                m.ValorProposta == 100m &&
                m.StatusProposta == StatusProposta.Pendente &&
                m.TipoMensagem == TipoMensagem.Proposta)
        ), Times.Once);
    }

    // ── AceitarPropostaAsync ───────────────────────────────────────────────────

    [Fact]
    public async Task AceitarPropostaAsync_PrestadorAceitaPropriaProposata_LancaExcecaoProibido()
    {
        var servicoId = Guid.NewGuid();
        var prestadorId = Guid.NewGuid();
        var mensagemId = Guid.NewGuid();
        var servico = CriarServico(servicoId, prestadorId: prestadorId);

        var proposta = new MensagemServico
        {
            Id = mensagemId, ServicoId = servicoId,
            RemetenteId = prestadorId, // própria proposta
            TipoMensagem = TipoMensagem.Proposta,
            StatusProposta = StatusProposta.Pendente,
            ValorProposta = 100m
        };

        _repositorioServicos.Setup(r => r.ObterPorIdAsync(servicoId)).ReturnsAsync(servico);
        _repositorioMensagens.Setup(r => r.ListarPorServicoAsync(servicoId)).ReturnsAsync([proposta]);

        await _sut.Invoking(s => s.AceitarPropostaAsync(servicoId, mensagemId, prestadorId))
            .Should().ThrowAsync<ExcecaoProibido>();
    }

    [Fact]
    public async Task AceitarPropostaAsync_PropostaNaoPendente_LancaExcecaoTransicaoInvalida()
    {
        var servicoId = Guid.NewGuid();
        var clienteId = Guid.NewGuid();
        var prestadorId = Guid.NewGuid();
        var mensagemId = Guid.NewGuid();
        var servico = CriarServico(servicoId, clienteId: clienteId, prestadorId: prestadorId);

        var proposta = new MensagemServico
        {
            Id = mensagemId, ServicoId = servicoId,
            RemetenteId = prestadorId,
            TipoMensagem = TipoMensagem.Proposta,
            StatusProposta = StatusProposta.Expirada, // não pendente
            ValorProposta = 100m
        };

        _repositorioServicos.Setup(r => r.ObterPorIdAsync(servicoId)).ReturnsAsync(servico);
        _repositorioMensagens.Setup(r => r.ListarPorServicoAsync(servicoId)).ReturnsAsync([proposta]);

        await _sut.Invoking(s => s.AceitarPropostaAsync(servicoId, mensagemId, clienteId))
            .Should().ThrowAsync<ExcecaoTransicaoInvalida>();
    }

    [Fact]
    public async Task AceitarPropostaAsync_ClienteAceitaPropostaPrestador_AvancaParaAguardandoPagamento()
    {
        var servicoId = Guid.NewGuid();
        var clienteId = Guid.NewGuid();
        var prestadorId = Guid.NewGuid();
        var mensagemId = Guid.NewGuid();

        var servico = CriarServico(servicoId, clienteId: clienteId, prestadorId: prestadorId);
        var proposta = new MensagemServico
        {
            Id = mensagemId, ServicoId = servicoId,
            RemetenteId = prestadorId,
            TipoMensagem = TipoMensagem.Proposta,
            StatusProposta = StatusProposta.Pendente,
            ValorProposta = 150m
        };

        _repositorioServicos.Setup(r => r.ObterPorIdAsync(servicoId)).ReturnsAsync(servico);
        _repositorioMensagens.Setup(r => r.ListarPorServicoAsync(servicoId)).ReturnsAsync([proposta]);
        _repositorioMensagens.Setup(r => r.AtualizarAsync(It.IsAny<MensagemServico>())).Returns(Task.CompletedTask);
        _repositorioServicos.Setup(r => r.AtualizarAsync(It.IsAny<Servico>())).ReturnsAsync((Servico s) => s);
        _repositorioCobrancas.Setup(r => r.AdicionarAsync(It.IsAny<Cobranca>())).ReturnsAsync((Cobranca c) => c);
        _repositorioAuditLog.Setup(r => r.RegistrarAsync(It.IsAny<AuditLog>())).Returns(Task.CompletedTask);
        _repositorioNotificacoes.Setup(r => r.AdicionarAsync(It.IsAny<Notificacao>())).Returns(Task.CompletedTask);

        var resultado = await _sut.AceitarPropostaAsync(servicoId, mensagemId, clienteId);

        resultado.Status.Should().Be("AguardandoPagamento");
        resultado.Preco.Should().Be(150m);

        _repositorioCobrancas.Verify(r => r.AdicionarAsync(It.Is<Cobranca>(c =>
            c.ValorTotal == 150m &&
            c.TaxaAdmin == 30m &&
            c.ValorPrestador == 120m &&
            c.Status == StatusCobranca.Pendente
        )), Times.Once);
    }

    // ── EnviarMensagemTextoAsync ───────────────────────────────────────────────

    [Fact]
    public async Task EnviarMensagemTextoAsync_ConteudoVazio_LancaExcecaoValidacao()
    {
        var servicoId = Guid.NewGuid();
        var clienteId = Guid.NewGuid();
        var servico = CriarServico(servicoId, clienteId: clienteId);
        _repositorioServicos.Setup(r => r.ObterPorIdAsync(servicoId)).ReturnsAsync(servico);

        await _sut.Invoking(s => s.EnviarMensagemTextoAsync(servicoId, clienteId, PapelRemetente.Cliente, "  "))
            .Should().ThrowAsync<ExcecaoValidacao>();
    }

    [Fact]
    public async Task EnviarMensagemTextoAsync_ServiçoConcluido_LancaExcecaoTransicaoInvalida()
    {
        var servicoId = Guid.NewGuid();
        var clienteId = Guid.NewGuid();
        var servico = CriarServico(servicoId, clienteId: clienteId, status: StatusServico.Concluido);
        _repositorioServicos.Setup(r => r.ObterPorIdAsync(servicoId)).ReturnsAsync(servico);

        await _sut.Invoking(s => s.EnviarMensagemTextoAsync(servicoId, clienteId, PapelRemetente.Cliente, "Olá"))
            .Should().ThrowAsync<ExcecaoTransicaoInvalida>();
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    private static Servico CriarServico(
        Guid id,
        Guid? clienteId = null,
        Guid? prestadorId = null,
        StatusServico status = StatusServico.EmNegociacao)
        => new()
        {
            Id = id,
            Titulo = "Serviço teste",
            CategoriaId = Guid.NewGuid(),
            ClienteId = clienteId,
            PrestadorId = prestadorId,
            Status = status,
            TaxaAdminRate = 0.2m
        };
}
