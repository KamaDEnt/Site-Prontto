namespace Prontto.Application.Perfil;

public interface IServicoPerfilPrestador
{
    /// <summary>
    /// Atualiza o perfil público do prestador.
    /// O Slug é gerado na primeira chamada (write-once, ADR-09) e ignorado em edições posteriores.
    /// </summary>
    Task<DtoPerfilPublico> AtualizarPerfilAsync(Guid usuarioId, ComandoAtualizarPerfil comando);

    /// <summary>Retorna o perfil público pelo slug. Lança ExcecaoNaoEncontrado se não existir.</summary>
    Task<DtoPerfilPublico> ObterPerfilPublicoAsync(string slug);

    /// <summary>Lista todas as categorias ativas, ordenadas por Ordem.</summary>
    Task<List<DtoCategoriaPublica>> ListarCategoriasAsync();

    /// <summary>Lista todas as cidades ativas, ordenadas por Nome.</summary>
    Task<List<DtoCidadePublica>> ListarCidadesAsync();
}
