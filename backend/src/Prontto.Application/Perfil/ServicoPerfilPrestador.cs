using System.Text;
using System.Text.RegularExpressions;
using Prontto.Application.Common;
using Prontto.Domain.Entities;
using Prontto.Domain.Enums;
using Prontto.Domain.Interfaces;

namespace Prontto.Application.Perfil;

public class ServicoPerfilPrestador(
    IRepositorioUsuario repositorioUsuarios,
    IRepositorioPerfilPrestador repositorioPerfil,
    IRepositorioCategoria repositorioCategorias,
    IRepositorioCidade repositorioCidades) : IServicoPerfilPrestador
{
    private const int MaxTentativasSlug = 5;

    public async Task<DtoPerfilPublico> AtualizarPerfilAsync(Guid usuarioId, ComandoAtualizarPerfil comando)
    {
        var usuario = await repositorioUsuarios.ObterPorIdAsync(usuarioId)
            ?? throw new ExcecaoNaoEncontrado("Usuário não encontrado");

        if (usuario.TipoConta != TipoConta.Prestador)
            throw new ExcecaoProibido("Apenas prestadores podem editar o perfil público");

        // Atualiza campos editáveis
        if (!string.IsNullOrWhiteSpace(comando.Nome))
            usuario.Nome = comando.Nome.Trim();

        if (comando.Descricao is not null)
            usuario.Descricao = comando.Descricao.Trim();

        if (comando.Especialidade is not null)
            usuario.Especialidade = comando.Especialidade.Trim();

        if (comando.FotoPerfilUrl is not null)
            usuario.FotoPerfilUrl = string.IsNullOrWhiteSpace(comando.FotoPerfilUrl)
                ? null
                : comando.FotoPerfilUrl.Trim();

        // Slug: write-once (ADR-09) — gerado apenas se ainda não existir
        if (string.IsNullOrEmpty(usuario.Slug))
            usuario.Slug = await GerarSlugUnicoAsync(usuario.Nome);

        usuario.AtualizadoEm = DateTime.UtcNow;

        var categoriaIds = comando.CategoriaIds ?? [];
        var cidadeIds = comando.CidadeIds ?? [];

        await repositorioPerfil.AtualizarPerfilAsync(usuario, categoriaIds, cidadeIds);

        // Recarrega com navegação para montar o DTO
        var perfilAtualizado = await repositorioPerfil.ObterPorSlugAsync(usuario.Slug!)
            ?? throw new ExcecaoNaoEncontrado("Perfil não encontrado após atualização");

        return MapearParaDto(perfilAtualizado);
    }

    public async Task<DtoPerfilPublico> ObterPerfilPublicoAsync(string slug)
    {
        var usuario = await repositorioPerfil.ObterPorSlugAsync(slug)
            ?? throw new ExcecaoNaoEncontrado("Prestador não encontrado");

        return MapearParaDto(usuario);
    }

    public async Task<List<DtoCategoriaPublica>> ListarCategoriasAsync()
    {
        var categorias = await repositorioCategorias.ListarAtivasAsync();
        return categorias.Select(c => new DtoCategoriaPublica(c.Id, c.Nome, c.Slug)).ToList();
    }

    public async Task<List<DtoCidadePublica>> ListarCidadesAsync()
    {
        var cidades = await repositorioCidades.ListarAtivasAsync();
        return cidades.Select(c => new DtoCidadePublica(c.Id, c.Nome, c.Estado, c.Slug)).ToList();
    }

    // ── Slug generation (ADR-08) ───────────────────────────────────────────────

    private async Task<string> GerarSlugUnicoAsync(string nome)
    {
        var base64Slug = NormalizarSlug(nome);

        for (var tentativa = 0; tentativa < MaxTentativasSlug; tentativa++)
        {
            // Sufixo de 4 chars hex aleatório (ex: "a8f3")
            var sufixo = Convert.ToHexString(System.Security.Cryptography.RandomNumberGenerator.GetBytes(2))
                .ToLowerInvariant();

            var candidato = $"{base64Slug}-{sufixo}";

            // Verifica unicidade — ignora soft-deleted (filtro global ativo)
            var existente = await repositorioUsuarios.ObterPorSlugAsync(candidato);
            if (existente is null)
                return candidato;
        }

        throw new InvalidOperationException("Não foi possível gerar um slug único após múltiplas tentativas");
    }

    /// <summary>
    /// Normaliza o nome para formato slug: [a-z0-9\-], sem acentos, separado por hífen.
    /// Exemplo: "João da Silva" → "joao-da-silva"
    /// </summary>
    private static string NormalizarSlug(string nome)
    {
        // Remove diacríticos (acentos)
        var normalizada = nome.Normalize(NormalizationForm.FormD);
        var semAcentos = new StringBuilder();

        foreach (var c in normalizada)
        {
            var categoria = System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c);
            if (categoria != System.Globalization.UnicodeCategory.NonSpacingMark)
                semAcentos.Append(c);
        }

        var slug = semAcentos.ToString().ToLowerInvariant();

        // Substitui qualquer char que não seja letra/dígito por hífen
        slug = Regex.Replace(slug, @"[^a-z0-9]+", "-");

        // Remove hífens no início e no fim
        slug = slug.Trim('-');

        // Limita a 40 caracteres para manter URLs razoáveis
        if (slug.Length > 40)
            slug = slug[..40].TrimEnd('-');

        return string.IsNullOrEmpty(slug) ? "prestador" : slug;
    }

    // ── Mapeamento ──────────────────────────────────────────────────────────────

    private static DtoPerfilPublico MapearParaDto(Usuario usuario)
        => new(
            Id: usuario.Id,
            Nome: usuario.Nome,
            FotoPerfilUrl: usuario.FotoPerfilUrl,
            Slug: usuario.Slug,
            Descricao: usuario.Descricao,
            Especialidade: usuario.Especialidade,
            MediaAvaliacoes: usuario.MediaAvaliacoes,
            TotalAvaliacoes: usuario.TotalAvaliacoes,
            Categorias: usuario.Categorias
                .Select(cu => new DtoCategoriaPublica(cu.Categoria.Id, cu.Categoria.Nome, cu.Categoria.Slug))
                .ToList(),
            Cidades: usuario.Cidades
                .Select(cu => new DtoCidadePublica(cu.Cidade.Id, cu.Cidade.Nome, cu.Cidade.Estado, cu.Cidade.Slug))
                .ToList(),
            ImagensPortfolio: usuario.ImagensPortfolio
                .Where(i => i.Aprovada == true)
                .OrderBy(i => i.Ordem)
                .Select(i => new DtoImagemPortfolio(i.Id, i.Url, i.Ordem))
                .ToList()
        );
}
