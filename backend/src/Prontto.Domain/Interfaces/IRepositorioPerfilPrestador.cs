using Prontto.Domain.Entities;

namespace Prontto.Domain.Interfaces;

public interface IRepositorioPerfilPrestador
{
    /// <summary>Carrega o prestador pelo slug com Categorias, Cidades e ImagensPortfolio incluídas.</summary>
    Task<Usuario?> ObterPorSlugAsync(string slug);

    /// <summary>
    /// Persiste as alterações de perfil e substitui completamente as associações
    /// de categorias e cidades do prestador.
    /// </summary>
    Task AtualizarPerfilAsync(Usuario usuario, IEnumerable<Guid> categoriaIds, IEnumerable<Guid> cidadeIds);

    /// <summary>Retorna imagens com Aprovada = true e DeletadoEm IS NULL, ordenadas por Ordem.</summary>
    Task<List<ImagemPortfolio>> ListarImagensAprovadasAsync(Guid usuarioId);

    Task<ImagemPortfolio?> ObterImagemPorIdAsync(Guid id);
    Task AdicionarImagemAsync(ImagemPortfolio imagem);
    Task RemoverImagemAsync(ImagemPortfolio imagem);
}
