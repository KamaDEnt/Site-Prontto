using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Prontto.Application.Admin;
using Prontto.Application.Auth;
using Prontto.Application.Common;
using Prontto.Application.Perfil;
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
        servicos.AddDbContext<ContextoBancoDados>(opt =>
            opt.UseNpgsql(configuracao.GetConnectionString("Default")));

        servicos.AddScoped<IRepositorioUsuario, RepositorioUsuario>();
        servicos.AddScoped<IRepositorioServico, RepositorioServico>();
        servicos.AddScoped<IRepositorioCobranca, RepositorioCobranca>();
        servicos.AddScoped<IRepositorioBanking, RepositorioBanking>();
        servicos.AddScoped<IRepositorioMensagem, RepositorioMensagem>();
        servicos.AddScoped<IRepositorioRefreshToken, RepositorioRefreshToken>();

        servicos.AddScoped<IRepositorioCategoria, RepositorioCategoria>();
        servicos.AddScoped<IRepositorioCidade, RepositorioCidade>();
        servicos.AddScoped<IRepositorioPerfilPrestador, RepositorioPerfilPrestador>();

        servicos.AddScoped<IHashSenha, HashSenhaBcrypt>();
        servicos.AddScoped<IServicoJwt, ServicoJwt>();
        servicos.AddScoped<IServicoAutenticacao, ServicoAutenticacao>();
        servicos.AddScoped<IServicoAdmin, ServicoAdmin>();
        servicos.AddScoped<IServicoPerfilPrestador, ServicoPerfilPrestador>();

        return servicos;
    }
}
