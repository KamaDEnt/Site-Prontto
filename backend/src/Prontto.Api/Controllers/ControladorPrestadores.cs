using Microsoft.AspNetCore.Mvc;
using Prontto.Application.Perfil;

namespace Prontto.Api.Controllers;

/// <summary>
/// Endpoints públicos de descoberta de prestadores e catálogos.
/// Nenhuma autenticação necessária (CA-01, RN-07).
/// </summary>
[ApiController]
public class ControladorPrestadores(IServicoPerfilPrestador servicoPerfil) : ControllerBase
{
    /// <summary>
    /// Perfil público do prestador pela URL canônica.
    /// Rota: GET /{cidadeSlug}/{categoriaSlug}/{slug}
    /// </summary>
    [HttpGet("{cidadeSlug}/{categoriaSlug}/{slug}")]
    public async Task<IActionResult> ObterPerfilPublico(
        [FromRoute] string cidadeSlug,
        [FromRoute] string categoriaSlug,
        [FromRoute] string slug)
    {
        // cidadeSlug e categoriaSlug compõem a URL canônica para SEO,
        // mas o prestador é localizado pelo slug único — não há validação de cidade/categoria aqui
        // pois o mesmo prestador pode atuar em múltiplas cidades/categorias.
        var perfil = await servicoPerfil.ObterPerfilPublicoAsync(slug);
        return Ok(perfil);
    }

    /// <summary>Lista todas as categorias ativas (para dropdowns no frontend).</summary>
    [HttpGet("api/categorias")]
    public async Task<IActionResult> ListarCategorias()
    {
        var categorias = await servicoPerfil.ListarCategoriasAsync();
        return Ok(categorias);
    }

    /// <summary>Lista todas as cidades ativas (para dropdowns no frontend).</summary>
    [HttpGet("api/cidades")]
    public async Task<IActionResult> ListarCidades()
    {
        var cidades = await servicoPerfil.ListarCidadesAsync();
        return Ok(cidades);
    }
}
