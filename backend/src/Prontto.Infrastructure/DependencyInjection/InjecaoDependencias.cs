using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Prontto.Application.Admin;
using Prontto.Application.Auth;
using Prontto.Application.Common;
using Prontto.Application.Financeiro;
using Prontto.Application.Perfil;
using Prontto.Application.Servicos;
using Prontto.Domain.Interfaces;
using Prontto.Infrastructure.Persistence.Context;
using Prontto.Infrastructure.Persistence.Repositories;
using Prontto.Infrastructure.Services;

namespace Prontto.Infrastructure.DependencyInjection;

public static class InjecaoDependencias
{
    public static IServiceCollection AdicionarInfraestrutura(
        this IServiceCollection servicos, IConfiguration configuracao)
    {
        var connectionString = configuracao.GetConnectionString("Default")
            ?? throw new InvalidOperationException("Connection string 'Default' não configurada.");

        servicos.AddDbContext<ContextoBancoDados>(opt =>
            opt.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

        // ── Repositórios ──────────────────────────────────────────────────────
        servicos.AddScoped<IRepositorioUsuario, RepositorioUsuario>();
        servicos.AddScoped<IRepositorioServico, RepositorioServico>();
        servicos.AddScoped<IRepositorioCobranca, RepositorioCobranca>();
        servicos.AddScoped<IRepositorioBanking, RepositorioBanking>();
        servicos.AddScoped<IRepositorioMensagem, RepositorioMensagem>();
        servicos.AddScoped<IRepositorioRefreshToken, RepositorioRefreshToken>();
        servicos.AddScoped<IRepositorioCategoria, RepositorioCategoria>();
        servicos.AddScoped<IRepositorioCidade, RepositorioCidade>();
        servicos.AddScoped<IRepositorioPerfilPrestador, RepositorioPerfilPrestador>();
        servicos.AddScoped<IRepositorioDisputa, RepositorioDisputa>();
        servicos.AddScoped<IRepositorioNotificacao, RepositorioNotificacao>();
        servicos.AddScoped<IRepositorioAuditLog, RepositorioAuditLog>();

        // ── Serviços de Aplicação ─────────────────────────────────────────────
        servicos.AddScoped<IHashSenha, HashSenhaBcrypt>();
        servicos.AddScoped<IServicoJwt, ServicoJwt>();
        servicos.AddScoped<IServicoAutenticacao, ServicoAutenticacao>();
        servicos.AddScoped<IServicoAdmin, ServicoAdmin>();
        servicos.AddScoped<IServicoPerfilPrestador, ServicoPerfilPrestador>();
        servicos.AddScoped<IServicoServico, ServicoServico>();
        servicos.AddScoped<IServicoNegociacao, ServicoNegociacao>();
        servicos.AddScoped<IServicoDisputa, ServicoDisputa>();
        servicos.AddScoped<IServicoFinanceiro, ServicoFinanceiro>();

        // ── Gateway de pagamento (Stub para desenvolvimento) ──────────────────
        servicos.AddScoped<IProcessadorPagamento, ProcessadorPagamentoStub>();

        // ── Jobs ──────────────────────────────────────────────────────────────
        servicos.AddHostedService<JobConclusaoAutomatica>();
        servicos.AddHostedService<JobExpiracaoPix>();

        return servicos;
    }
}
