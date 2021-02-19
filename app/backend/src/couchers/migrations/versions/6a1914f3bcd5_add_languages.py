"""Add languages

Revision ID: 6a1914f3bcd5
Revises: c4445e08ea86
Create Date: 2021-02-18 20:32:34.531591

"""
import geoalchemy2
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "6a1914f3bcd5"
down_revision = "c4445e08ea86"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "languages",
        sa.Column("code", sa.String(length=3), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("code", name=op.f("pk_languages")),
        sa.UniqueConstraint("name", name=op.f("uq_languages_name")),
    )
    op.create_table(
        "language_abilities",
        sa.Column("id", sa.BigInteger(), nullable=False),
        sa.Column("user_id", sa.BigInteger(), nullable=False),
        sa.Column("language_code", sa.String(length=3), nullable=False),
        sa.Column(
            "fluency",
            sa.Enum("say_hello", "beginner", "intermediate", "advanced", "fluent", "native", name="languagefluency"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["language_code"], ["languages.code"], name=op.f("fk_language_abilities_language_code_languages")
        ),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], name=op.f("fk_language_abilities_user_id_users")),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_language_abilities")),
        sa.UniqueConstraint("user_id", "language_code", name=op.f("uq_language_abilities_user_id")),
    )
    op.create_index(op.f("ix_language_abilities_user_id"), "language_abilities", ["user_id"], unique=False)
    op.drop_column("users", "languages")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("users", sa.Column("languages", sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column("clusters", sa.Column("thread_id", sa.BIGINT(), autoincrement=False, nullable=False))
    op.drop_index(op.f("ix_language_abilities_user_id"), table_name="language_abilities")
    op.drop_table("language_abilities")
    op.drop_table("languages")
    # ### end Alembic commands ###
