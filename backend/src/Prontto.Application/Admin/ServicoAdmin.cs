using Microsoft.Extensions.Caching.Memory;
using Prontto.Domain.Entities;
using Prontto.Domain.Enums;
using Prontto.Domain.Interfaces;
using Prontto.Application.Common;

namespace Prontto.Application.Admin;

public class ServicoAdmin(
    IRepositorioUsuario repositorioUsuarios,
    IRepositorioServico repositorioServicos,
    IRepositorioCobranca repositorioCobrancas,
    IRepositorioMensagem repositorioMensagens,
    IRepositorioAuditLog repositorioAuditLog,
    IMemoryCache cache) : IServicoAdmin
{
    private const string ChaveCacheEstatisticas = "admin:stats";

    public Task<EstatisticasAdmin> ObterEstatisticasAsync()
        => cache.GetOrCreateAsync(ChaveCacheEstatisticas, entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);
            return BuscarEstatisticasNoBancoAsync();
        })!;

    private async Task<EstatisticasAdmin> BuscarEstatisticasNoBancoAsync()
    {
        var todosUsuarios = await repositorioUsuarios.ListarNaoAdminsAsync();
        var totalServicos = await repositorioServicos.ContarTodosAsync();

        return new EstatisticasAdmin(
            Usuarios: new EstatisticasUsuarios(
                Total: todosUsuarios.Count,
                Clientes: todosUsuarios.Count(u => u.TipoConta == TipoConta.Cliente),
                Prestadores: todosUsuarios.Count(u => u.TipoConta == TipoConta.Prestador)
            ),
            Servicos: new EstatisticasServicos(
                Total: totalServicos,
                Pendentes: await repositorioServicos.ContarPorStatusAsync(StatusServico.EmNegociacao),
                EmAndamento: await repositorioServicos.ContarPorStatusAsync(StatusServico.EmAndamento),
                Concluidos: await repositorioServicos.ContarPorStatusAsync(StatusServico.Concluido)
            ),
            Receita: new EstatisticasReceita(
                Ganha: await repositorioCobrancas.SomarTaxaAdminPorStatusAsync(StatusCobranca.Pago),
                Pendente: await repositorioCobrancas.SomarTaxaAdminPorStatusAsync(StatusCobranca.Pendente),
                Gmv: await repositorioCobrancas.SomarValorTotalPorStatusAsync(StatusCobranca.Pago)
            )
        );
    }

    public async Task<IReadOnlyList<Usuario>> ListarUsuariosAsync()
        => await repositorioUsuarios.ListarNaoAdminsAsync();

    public async Task<IReadOnlyList<Servico>> ListarServicosAsync()
        => await repositorioServicos.ListarTodosAsync();

    public async Task<Servico> AtualizarStatusServicoAsync(Guid idServico, StatusServico novoStatus)
    {
        var servico = await repositorioServicos.ObterPorIdAsync(idServico)
            ?? throw new ExcecaoNaoEncontrado("Serviço não encontrado");

        servico.Status = novoStatus;
        servico.AtualizadoEm = DateTime.UtcNow;

        if (novoStatus == StatusServico.Concluido)
        {
            servico.ConcluidoEm = DateTime.UtcNow;

            if (!await repositorioCobrancas.ExistePorServicoAsync(idServico))
            {
                var taxaAdmin = Math.Round(servico.Preco * servico.TaxaAdminRate, 2);
                var valorPrestador = servico.Preco - taxaAdmin;

                await repositorioCobrancas.AdicionarAsync(new Cobranca
                {
                    ServicoId = idServico,
                    ValorTotal = servico.Preco,
                    TaxaAdmin = taxaAdmin,
                    ValorPrestador = valorPrestador,
                    Status = StatusCobranca.Pago,
                    PagadoEm = DateTime.UtcNow,
                });
            }
        }

        var servicoAtualizado = await repositorioServicos.AtualizarAsync(servico);

        await repositorioAuditLog.RegistrarAsync(new AuditLog
        {
            UsuarioId = null,
            Acao = "admin.servico.status_alterado",
            Entidade = "Servico",
            EntidadeId = idServico.ToString(),
            Detalhes = $"Status alterado para {novoStatus}",
        });

        return servicoAtualizado;
    }

    public async Task<IReadOnlyList<MensagemServico>> ListarMensagensServicoAsync(Guid idServico)
        => await repositorioMensagens.ListarPorServicoAsync(idServico);

    public async Task<MensagemServico> EnviarMensagemAsync(Guid idServico, Guid idRemetente, string conteudo)
    {
        if (string.IsNullOrWhiteSpace(conteudo))
            throw new ExcecaoValidacao("Mensagem vazia");

        return await repositorioMensagens.AdicionarAsync(new MensagemServico
        {
            ServicoId = idServico,
            RemetenteId = idRemetente,
            PapelRemetente = PapelRemetente.Admin,
            Conteudo = conteudo.Trim(),
        });
    }

    public async Task<IReadOnlyList<Cobranca>> ListarCobrancasAsync()
        => await repositorioCobrancas.ListarTodosAsync();
}
