'use client';

import { useState, useEffect } from 'react';
import { BlogPost, getAllPosts, deletePost, updatePost, createPost } from '@/lib/services/blogService';
import BlogPostForm from './BlogPostForm';
import { useAuth } from '@/context/AuthContext';

export default function BlogPostList() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      alert('Error al cargar los posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPost(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const handleSave = async (data: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    published: boolean;
  }) => {
    if (!user) {
      alert('Debes estar autenticado para crear/editar posts');
      return;
    }

    try {
      if (editingPost) {
        await updatePost(editingPost.id, data);
      } else {
        await createPost(
          data.title,
          data.slug,
          data.excerpt,
          data.content,
          user.$id,
          data.published
        );
      }
      await loadPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      throw error;
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('¿Estás seguro de eliminar este post?')) {
      return;
    }
    try {
      await deletePost(postId);
      await loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error al eliminar el post');
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      await updatePost(post.id, { published: !post.published });
      await loadPosts();
    } catch (error) {
      console.error('Error toggling publish:', error);
      alert('Error al cambiar estado de publicación');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gunmetal dark:text-pale-sky">Cargando posts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gunmetal dark:text-alice-blue">
          Gestionar Blog
        </h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-cool-sky hover:bg-cool-sky/90 text-gunmetal font-medium rounded-md transition-colors"
        >
          + Nuevo Post
        </button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-6 bg-alice-blue dark:bg-pale-sky/10 rounded-xl border border-dust-grey/30 dark:border-pale-sky/20 hover:border-cool-sky/40 dark:hover:border-cool-sky/30 transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gunmetal dark:text-alice-blue">
                    {post.title}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      post.published
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {post.published ? 'Publicado' : 'Borrador'}
                  </span>
                </div>
                <p className="text-gunmetal/70 dark:text-pale-sky/80 mb-2">{post.excerpt}</p>
                <div className="text-sm text-gunmetal/50 dark:text-pale-sky/60">
                  <span>Slug: /blog/{post.slug}</span>
                  {post.publishedAt && (
                    <span className="ml-4">
                      Publicado: {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(post)}
                  className="p-2 bg-cool-sky text-gunmetal rounded hover:bg-cool-sky/90"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleTogglePublish(post)}
                  className={`p-2 rounded ${
                    post.published
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                  title={post.published ? 'Despublicar' : 'Publicar'}
                >
                  {post.published ? '👁️' : '✓'}
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12 text-gunmetal/70 dark:text-pale-sky/70">
          No hay posts. Crea uno nuevo para comenzar.
        </div>
      )}

      <BlogPostForm
        post={editingPost}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

