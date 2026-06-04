using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Prontto.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RF02_PerfilPrestador : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // NOTA: As tabelas categorias, cidades, imagens_portfolio, usuarios_categorias e
            // usuarios_cidades foram criadas pelo schema.sql antes desta migration.
            // Usamos CREATE TABLE IF NOT EXISTS para que a migration seja idempotente.
            // Os índices EF Core (IX_*) são adicionados apenas se não existirem.

            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS categorias (
                    id              uuid        NOT NULL DEFAULT gen_random_uuid(),
                    nome            text        NOT NULL,
                    slug            text        NOT NULL,
                    ativo           boolean     NOT NULL DEFAULT TRUE,
                    ordem_exibicao  integer     NOT NULL DEFAULT 0,
                    CONSTRAINT pk_categorias PRIMARY KEY (id),
                    CONSTRAINT uq_categorias_slug UNIQUE (slug)
                );
            ");

            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS cidades (
                    id      uuid        NOT NULL DEFAULT gen_random_uuid(),
                    nome    text        NOT NULL,
                    estado  char(2)     NOT NULL,
                    slug    text        NOT NULL,
                    ativo   boolean     NOT NULL DEFAULT TRUE,
                    CONSTRAINT pk_cidades PRIMARY KEY (id),
                    CONSTRAINT uq_cidades_slug UNIQUE (slug)
                );
            ");

            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS imagens_portfolio (
                    id                      uuid        NOT NULL DEFAULT gen_random_uuid(),
                    usuario_id              uuid        NOT NULL,
                    url                     text        NOT NULL,
                    cloudinary_public_id    text        NOT NULL,
                    moderado                boolean     NOT NULL DEFAULT FALSE,
                    aprovado                boolean,
                    ordem_exibicao          integer     NOT NULL DEFAULT 0,
                    criado_em               timestamptz NOT NULL DEFAULT NOW(),
                    deletado_em             timestamptz,
                    CONSTRAINT pk_imagens_portfolio PRIMARY KEY (id),
                    CONSTRAINT fk_imagens_portfolio_user
                        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
                );
            ");

            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS usuarios_categorias (
                    usuario_id      uuid    NOT NULL,
                    categoria_id    uuid    NOT NULL,
                    CONSTRAINT pk_usuarios_categorias PRIMARY KEY (usuario_id, categoria_id),
                    CONSTRAINT fk_usuarios_categorias_user
                        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                    CONSTRAINT fk_usuarios_categorias_category
                        FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT
                );
            ");

            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS usuarios_cidades (
                    usuario_id  uuid    NOT NULL,
                    cidade_id   uuid    NOT NULL,
                    CONSTRAINT pk_usuarios_cidades PRIMARY KEY (usuario_id, cidade_id),
                    CONSTRAINT fk_usuarios_cidades_user
                        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                    CONSTRAINT fk_usuarios_cidades_city
                        FOREIGN KEY (cidade_id) REFERENCES cidades(id) ON DELETE RESTRICT
                );
            ");

            // Índices EF Core — criados apenas se ainda não existirem
            migrationBuilder.Sql(@"
                CREATE UNIQUE INDEX IF NOT EXISTS ""IX_categorias_slug""
                    ON categorias (slug);
            ");

            migrationBuilder.Sql(@"
                CREATE UNIQUE INDEX IF NOT EXISTS ""IX_cidades_slug""
                    ON cidades (slug);
            ");

            migrationBuilder.Sql(@"
                CREATE INDEX IF NOT EXISTS ""IX_imagens_portfolio_usuario_id_ordem_exibicao""
                    ON imagens_portfolio (usuario_id, ordem_exibicao)
                    WHERE deletado_em IS NULL AND aprovado = TRUE;
            ");

            migrationBuilder.Sql(@"
                CREATE INDEX IF NOT EXISTS ""IX_usuarios_categorias_categoria_id""
                    ON usuarios_categorias (categoria_id);
            ");

            migrationBuilder.Sql(@"
                CREATE INDEX IF NOT EXISTS ""IX_usuarios_cidades_cidade_id""
                    ON usuarios_cidades (cidade_id);
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP TABLE IF EXISTS imagens_portfolio CASCADE;");
            migrationBuilder.Sql("DROP TABLE IF EXISTS usuarios_categorias CASCADE;");
            migrationBuilder.Sql("DROP TABLE IF EXISTS usuarios_cidades CASCADE;");
            migrationBuilder.Sql("DROP TABLE IF EXISTS categorias CASCADE;");
            migrationBuilder.Sql("DROP TABLE IF EXISTS cidades CASCADE;");
        }
    }
}
