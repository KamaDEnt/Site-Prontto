using Microsoft.EntityFrameworkCore;
using Prontto.Domain.Entities;
using Prontto.Domain.Enums;

namespace Prontto.Infrastructure.Persistence.Context;

public class ContextoBancoDados(DbContextOptions<ContextoBancoDados> opcoes) : DbContext(opcoes)
{
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<DadosBancarios> DadosBancarios => Set<DadosBancarios>();
    public DbSet<Servico> Servicos => Set<Servico>();
    public DbSet<MensagemServico> MensagensServico => Set<MensagemServico>();
    public DbSet<Cobranca> Cobrancas => Set<Cobranca>();
    public DbSet<Categoria> Categorias => Set<Categoria>();
    public DbSet<Cidade> Cidades => Set<Cidade>();
    public DbSet<CategoriaUsuario> CategoriasUsuario => Set<CategoriaUsuario>();
    public DbSet<CidadeUsuario> CidadesUsuario => Set<CidadeUsuario>();
    public DbSet<ImagemPortfolio> ImagensPortfolio => Set<ImagemPortfolio>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── Usuario ────────────────────────────────────────────────────────────
        modelBuilder.Entity<Usuario>(e =>
        {
            e.ToTable("usuarios");
            e.HasIndex(u => u.Email).IsUnique();
            e.HasIndex(u => u.Slug).IsUnique().HasFilter("slug IS NOT NULL");

            e.Property(u => u.Id).HasColumnName("id");
            e.Property(u => u.Nome).HasColumnName("nome");
            e.Property(u => u.Email).HasColumnName("email");
            e.Property(u => u.Telefone).HasColumnName("telefone");
            e.Property(u => u.HashSenha).HasColumnName("hash_senha");
            e.Property(u => u.TipoConta).HasColumnName("tipo_conta").HasConversion<string>();
            e.Property(u => u.Papel).HasColumnName("papel").HasConversion<string>();
            e.Property(u => u.Especialidade).HasColumnName("especialidade");
            e.Property(u => u.CidadeId).HasColumnName("cidade_id");
            e.Property(u => u.Cpf).HasColumnName("cpf");
            e.Property(u => u.FotoPerfilUrl).HasColumnName("url_foto_perfil");
            e.Property(u => u.Slug).HasColumnName("slug");
            e.Property(u => u.Descricao).HasColumnName("descricao");
            e.Property(u => u.MediaAvaliacoes).HasColumnName("media_avaliacoes").HasPrecision(3, 2);
            e.Property(u => u.TotalAvaliacoes).HasColumnName("total_avaliacoes");
            e.Property(u => u.CriadoEm).HasColumnName("criado_em");
            e.Property(u => u.AtualizadoEm).HasColumnName("atualizado_em");
            e.Property(u => u.DeletadoEm).HasColumnName("deletado_em");

            // Filtro global de soft delete — usuários deletados ficam invisíveis
            e.HasQueryFilter(u => u.DeletadoEm == null);
        });

        // ── RefreshToken ───────────────────────────────────────────────────────
        modelBuilder.Entity<RefreshToken>(e =>
        {
            e.ToTable("tokens_renovacao");
            e.HasIndex(t => t.Token).IsUnique();
            e.HasIndex(t => new { t.UsuarioId, t.RevogadoEm });

            e.Property(t => t.Id).HasColumnName("id");
            e.Property(t => t.UsuarioId).HasColumnName("usuario_id");
            e.Property(t => t.Token).HasColumnName("token");
            e.Property(t => t.ExpiracaoEm).HasColumnName("expira_em");
            e.Property(t => t.RevogadoEm).HasColumnName("revogado_em");
            e.Property(t => t.SubstituidoPor).HasColumnName("substituido_por");
            e.Property(t => t.Ip).HasColumnName("endereco_ip");
            e.Property(t => t.UserAgent).HasColumnName("user_agent");
            e.Property(t => t.CriadoEm).HasColumnName("criado_em");

            e.HasOne(t => t.Usuario)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(t => t.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ── DadosBancarios ─────────────────────────────────────────────────────
        modelBuilder.Entity<DadosBancarios>(e =>
        {
            e.ToTable("dados_bancarios");

            e.Property(b => b.Id).HasColumnName("id");
            e.Property(b => b.UsuarioId).HasColumnName("usuario_id");
            e.Property(b => b.TipoChavePix).HasColumnName("tipo_chave_pix").HasConversion<string>();
            e.Property(b => b.ChavePix).HasColumnName("chave_pix");
            e.Property(b => b.NomeCompleto).HasColumnName("nome_completo");
            e.Property(b => b.CpfCnpj).HasColumnName("cpf_cnpj");
            e.Property(b => b.NomeBanco).HasColumnName("nome_banco");
            e.Property(b => b.Agencia).HasColumnName("agencia");
            e.Property(b => b.NumeroConta).HasColumnName("numero_conta");
            e.Property(b => b.TipoConta).HasColumnName("tipo_conta");
            e.Property(b => b.CriadoEm).HasColumnName("criado_em");
            e.Property(b => b.AtualizadoEm).HasColumnName("atualizado_em");

            e.HasOne(b => b.Usuario)
                .WithOne(u => u.DadosBancarios)
                .HasForeignKey<DadosBancarios>(b => b.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ── Servico ────────────────────────────────────────────────────────────
        modelBuilder.Entity<Servico>(e =>
        {
            e.ToTable("servicos");

            e.HasIndex(s => s.ClienteId);
            e.HasIndex(s => s.PrestadorId);
            e.HasIndex(s => s.Status);
            e.HasIndex(s => s.AguardandoConfirmacaoDesde);

            e.Property(s => s.Id).HasColumnName("id");
            e.Property(s => s.Titulo).HasColumnName("titulo");
            e.Property(s => s.Descricao).HasColumnName("descricao");
            e.Property(s => s.Categoria).HasColumnName("categoria");
            e.Property(s => s.ClienteId).HasColumnName("cliente_id");
            e.Property(s => s.PrestadorId).HasColumnName("prestador_id");
            e.Property(s => s.Preco).HasColumnName("preco").HasPrecision(10, 2);
            e.Property(s => s.TaxaAdminRate).HasColumnName("taxa_admin_percentual").HasPrecision(5, 4);
            e.Property(s => s.Status).HasColumnName("status").HasConversion<string>();
            e.Property(s => s.Endereco).HasColumnName("endereco");
            e.Property(s => s.AgendadoEm).HasColumnName("agendado_em");
            e.Property(s => s.ConcluidoEm).HasColumnName("concluido_em");
            e.Property(s => s.AguardandoConfirmacaoDesde).HasColumnName("aguardando_confirmacao_desde");
            e.Property(s => s.CriadoEm).HasColumnName("criado_em");
            e.Property(s => s.AtualizadoEm).HasColumnName("atualizado_em");
            e.Property(s => s.DeletadoEm).HasColumnName("deletado_em");

            e.HasQueryFilter(s => s.DeletadoEm == null);

            e.HasOne(s => s.Cliente)
                .WithMany(u => u.ServicosComoCliente)
                .HasForeignKey(s => s.ClienteId)
                .OnDelete(DeleteBehavior.SetNull);

            e.HasOne(s => s.Prestador)
                .WithMany(u => u.ServicosComoPrestador)
                .HasForeignKey(s => s.PrestadorId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // ── MensagemServico ────────────────────────────────────────────────────
        modelBuilder.Entity<MensagemServico>(e =>
        {
            e.ToTable("mensagens_servico");

            e.HasIndex(m => new { m.ServicoId, m.CriadoEm });

            e.Property(m => m.Id).HasColumnName("id");
            e.Property(m => m.ServicoId).HasColumnName("servico_id");
            e.Property(m => m.RemetenteId).HasColumnName("remetente_id");
            e.Property(m => m.PapelRemetente).HasColumnName("papel_remetente").HasConversion<string>();
            e.Property(m => m.TipoMensagem).HasColumnName("tipo_mensagem").HasConversion<string>();
            e.Property(m => m.Conteudo).HasColumnName("conteudo");
            e.Property(m => m.ValorProposta).HasColumnName("valor_proposta").HasPrecision(10, 2);
            e.Property(m => m.StatusProposta).HasColumnName("status_proposta").HasConversion<string>();
            e.Property(m => m.ImagemModerada).HasColumnName("imagem_moderada");
            e.Property(m => m.ImagemAprovada).HasColumnName("imagem_aprovada");
            e.Property(m => m.CriadoEm).HasColumnName("criado_em");

            e.HasOne(m => m.Servico)
                .WithMany(s => s.Mensagens)
                .HasForeignKey(m => m.ServicoId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(m => m.Remetente)
                .WithMany(u => u.Mensagens)
                .HasForeignKey(m => m.RemetenteId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // ── Cobranca ───────────────────────────────────────────────────────────
        modelBuilder.Entity<Cobranca>(e =>
        {
            e.ToTable("cobrancas");

            e.HasIndex(c => c.ServicoId).IsUnique();
            e.HasIndex(c => new { c.Status, c.PixExpiracaoEm });
            e.HasIndex(c => c.PagarmeOrderId).IsUnique().HasFilter("pagarme_order_id IS NOT NULL");

            e.Property(c => c.Id).HasColumnName("id");
            e.Property(c => c.ServicoId).HasColumnName("servico_id");
            e.Property(c => c.ValorTotal).HasColumnName("valor_total").HasPrecision(10, 2);
            e.Property(c => c.TaxaAdmin).HasColumnName("taxa_admin").HasPrecision(10, 2);
            e.Property(c => c.ValorPrestador).HasColumnName("valor_prestador").HasPrecision(10, 2);
            e.Property(c => c.Status).HasColumnName("status").HasConversion<string>();
            e.Property(c => c.PagarmeOrderId).HasColumnName("pagarme_order_id");
            e.Property(c => c.PagarmePagamentoId).HasColumnName("pagarme_payment_id");
            e.Property(c => c.PixQrCode).HasColumnName("pix_qr_code");
            e.Property(c => c.PixCopiaCola).HasColumnName("pix_copia_cola");
            e.Property(c => c.PixExpiracaoEm).HasColumnName("pix_expira_em");
            e.Property(c => c.PagadoEm).HasColumnName("pago_em");
            e.Property(c => c.RetidoEm).HasColumnName("retido_em");
            e.Property(c => c.LiberadoEm).HasColumnName("liberado_em");
            e.Property(c => c.CriadoEm).HasColumnName("criado_em");
            e.Property(c => c.AtualizadoEm).HasColumnName("atualizado_em");

            e.HasOne(c => c.Servico)
                .WithOne(s => s.Cobranca)
                .HasForeignKey<Cobranca>(c => c.ServicoId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ── Categoria ──────────────────────────────────────────────────────────
        modelBuilder.Entity<Categoria>(e =>
        {
            e.ToTable("categorias");
            e.HasIndex(c => c.Slug).IsUnique();

            e.Property(c => c.Id).HasColumnName("id");
            e.Property(c => c.Nome).HasColumnName("nome");
            e.Property(c => c.Slug).HasColumnName("slug");
            e.Property(c => c.Ativa).HasColumnName("ativo");
            e.Property(c => c.Ordem).HasColumnName("ordem_exibicao");
        });

        // ── Cidade ─────────────────────────────────────────────────────────────
        modelBuilder.Entity<Cidade>(e =>
        {
            e.ToTable("cidades");
            e.HasIndex(c => c.Slug).IsUnique();

            e.Property(c => c.Id).HasColumnName("id");
            e.Property(c => c.Nome).HasColumnName("nome");
            e.Property(c => c.Estado).HasColumnName("estado");
            e.Property(c => c.Slug).HasColumnName("slug");
            e.Property(c => c.Ativa).HasColumnName("ativo");
        });

        // ── CategoriaUsuario ───────────────────────────────────────────────────
        modelBuilder.Entity<CategoriaUsuario>(e =>
        {
            e.ToTable("usuarios_categorias");
            e.HasKey(cu => new { cu.UsuarioId, cu.CategoriaId });

            e.Property(cu => cu.UsuarioId).HasColumnName("usuario_id");
            e.Property(cu => cu.CategoriaId).HasColumnName("categoria_id");

            e.HasOne(cu => cu.Usuario)
                .WithMany(u => u.Categorias)
                .HasForeignKey(cu => cu.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(cu => cu.Categoria)
                .WithMany(c => c.Usuarios)
                .HasForeignKey(cu => cu.CategoriaId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ── CidadeUsuario ──────────────────────────────────────────────────────
        modelBuilder.Entity<CidadeUsuario>(e =>
        {
            e.ToTable("usuarios_cidades");
            e.HasKey(cu => new { cu.UsuarioId, cu.CidadeId });

            e.Property(cu => cu.UsuarioId).HasColumnName("usuario_id");
            e.Property(cu => cu.CidadeId).HasColumnName("cidade_id");

            e.HasOne(cu => cu.Usuario)
                .WithMany(u => u.Cidades)
                .HasForeignKey(cu => cu.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(cu => cu.Cidade)
                .WithMany(c => c.Usuarios)
                .HasForeignKey(cu => cu.CidadeId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ── ImagemPortfolio ────────────────────────────────────────────────────
        modelBuilder.Entity<ImagemPortfolio>(e =>
        {
            e.ToTable("imagens_portfolio");

            e.HasIndex(i => new { i.UsuarioId, i.Ordem })
                .HasFilter("deletado_em IS NULL AND aprovado = TRUE");

            e.Property(i => i.Id).HasColumnName("id");
            e.Property(i => i.UsuarioId).HasColumnName("usuario_id");
            e.Property(i => i.Url).HasColumnName("url");
            e.Property(i => i.CloudinaryPublicId).HasColumnName("cloudinary_public_id");
            e.Property(i => i.Moderada).HasColumnName("moderado");
            e.Property(i => i.Aprovada).HasColumnName("aprovado");
            e.Property(i => i.Ordem).HasColumnName("ordem_exibicao");
            e.Property(i => i.CriadoEm).HasColumnName("criado_em");
            e.Property(i => i.DeletadoEm).HasColumnName("deletado_em");

            // Soft delete: imagens deletadas são invisíveis por padrão
            e.HasQueryFilter(i => i.DeletadoEm == null);

            e.HasOne(i => i.Usuario)
                .WithMany(u => u.ImagensPortfolio)
                .HasForeignKey(i => i.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
