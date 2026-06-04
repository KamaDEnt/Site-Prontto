namespace Prontto.Application.Perfil;

/// <summary>
/// Perfil público do prestador.
/// LGPD: nunca incluir email, CPF, hashSenha ou dados bancários.
/// </summary>
public record DtoPerfilPublico(
    Guid Id,
    string Nome,
    string? FotoPerfilUrl,
    string? Slug,
    string? Descricao,
    string? Especialidade,
    decimal MediaAvaliacoes,
    int TotalAvaliacoes,
    List<DtoCategoriaPublica> Categorias,
    List<DtoCidadePublica> Cidades,
    List<DtoImagemPortfolio> ImagensPortfolio
);

public record DtoCategoriaPublica(Guid Id, string Nome, string Slug);

public record DtoCidadePublica(Guid Id, string Nome, string Estado, string Slug);

public record DtoImagemPortfolio(Guid Id, string Url, int Ordem);

/// <summary>Payload para criação/edição de perfil do prestador.</summary>
public record ComandoAtualizarPerfil(
    string? Nome,
    string? Descricao,
    string? Especialidade,
    string? FotoPerfilUrl,
    List<Guid>? CategoriaIds,
    List<Guid>? CidadeIds
);
