import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewsPost {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  published_at: string;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'long' });
  } catch {
    return iso;
  }
}

export default function NewsPostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      const { data } = await supabase
        .from('news_posts')
        .select('title, slug, excerpt, content, image_url, published_at')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

      if (data) setPost(data);
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The news or event you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/news"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-slate-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to News and Events
          </Link>

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-gray-300 mb-4">
              <Calendar className="w-5 h-5" />
              <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-4 text-xl text-gray-200 leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {post.image_url && (
          <div className="rounded-xl overflow-hidden shadow-xl mb-10">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {post.content || ''}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News and Events
          </Link>
        </div>
      </div>
    </div>
  );
}
