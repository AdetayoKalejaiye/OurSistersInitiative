"""Initial migration.

Revision ID: 600933b142c8
Revises: 
Create Date: 2024-10-30 00:27:39.593800
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '600933b142c8'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Check if the 'comment' table already exists
    conn = op.get_bind()
    if not conn.dialect.has_table(conn, 'comment'):
        op.create_table('comment',
            sa.Column('id', sa.Integer(), primary_key=True),
            sa.Column('content', sa.Text(), nullable=False),
            sa.Column('timestamp', sa.DateTime(), index=True, default=sa.func.now()),
            sa.Column('user_id', sa.Integer(), nullable=False),
            sa.Column('post_id', sa.Integer(), nullable=False),
            sa.ForeignKeyConstraint(['user_id'], ['user.id'], name='fk_comment_user'),
            sa.ForeignKeyConstraint(['post_id'], ['post.id'], name='fk_comment_post'),
        )
    # Alter the 'news_article' table's 'published_at' column
    with op.batch_alter_table('news_article', schema=None) as batch_op:
        batch_op.alter_column('published_at',
               existing_type=sa.DATETIME(),
               nullable=True)


def downgrade():
    # Drop the 'comment' table
    op.drop_table('comment')

    # Revert the alteration on 'news_article'
    with op.batch_alter_table('news_article', schema=None) as batch_op:
        batch_op.alter_column('published_at',
               existing_type=sa.DATETIME(),
               nullable=False)
