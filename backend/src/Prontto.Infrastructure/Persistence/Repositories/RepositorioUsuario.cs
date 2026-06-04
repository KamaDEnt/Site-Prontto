using Microsoft.EntityFrameworkCore;
using Prontto.Domain.Entities;
using Prontto.Domain.Enums;
using Prontto.Domain.Interfaces;
using Prontto.Infrastructure.Persistence.Context;

namespace Prontto.Infrastructure.Persistence.Repositories;

public class RepositorioUsuario(ContextoBancoDados db) : IRepositorioUsuario
{
    public Task<Usuario?> ObterPorIdAsync(Guid id)
        => db.Usuarios.FirstOrDefaultAsync(usuario => usuario.Id == id);

    public Task<Usuario?> ObterPorEmailAsync(string email)
        => db.Usuarios.FirstOrDefaultAsync(usuario => usuario.Email == email);

    public Task<Usuario?> ObterPorSlugAsync(string slug)
        => db.Usuarios.FirstOrDefaultAsync(usuario => usuario.Slug == slug);

    public async Task<IReadOnlyList<Usuario>> ListarNaoAdminsAsync()
        => await db.Usuarios
            .Where(usuario => usuario.Papel != Papel.Admin)
            .OrderByDescending(usuario => usuario.CriadoEm)
            .ToListAsync();

    public async Task<Usuario> AdicionarAsync(Usuario usuario)
    {
        db.Usuarios.Add(usuario);
        await db.SaveChangesAsync();
        return usuario;
    }

    public async Task<Usuario> AtualizarAsync(Usuario usuario)
    {
        db.Usuarios.Update(usuario);
        await db.SaveChangesAsync();
        return usuario;
    }
}
