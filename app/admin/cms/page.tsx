"use client";

import { useEffect, useMemo, useState } from "react";
import RichEditor from "@/app/admin/cms/components/rich-editor";

type TabKey = "dashboard" | "posts" | "taxonomy" | "media" | "users" | "settings";

type CmsStats = {
  posts: number;
  publishedPosts: number;
  categories: number;
  tags: number;
  media: number;
  users: number;
  settings: number;
};

type CmsCategory = { id: number; name: string; slug: string; description: string | null };
type CmsTag = { id: number; name: string; slug: string };
type CmsPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: "draft" | "published";
  authorUserId: number | null;
  categories: Array<{ id: number; name: string; slug: string }>;
  tags: Array<{ id: number; name: string; slug: string }>;
  updatedAt: string;
};

type CmsMedia = {
  id: number;
  title: string;
  url: string;
  altText: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  createdAt: string;
};

type CmsUser = {
  id: number;
  name: string;
  email: string;
  active: boolean;
  roles: string[];
  createdAt: string;
};

type CmsSetting = {
  id: number;
  keyName: string;
  value: string;
  groupName: string;
  updatedAt: string;
};

type PostFormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: "draft" | "published";
  authorUserId: string;
  categoryIds: number[];
  tagIds: number[];
};

const defaultPostForm: PostFormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  status: "draft",
  authorUserId: "",
  categoryIds: [],
  tagIds: [],
};

async function apiRequest(path: string, init?: RequestInit) {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok || payload?.ok === false) {
    const message = typeof payload?.error === "string" ? payload.error : `HTTP_${res.status}`;
    throw new Error(message);
  }

  return payload;
}

export default function CmsAdminPage() {
  const [tab, setTab] = useState<TabKey>("dashboard");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string>("");

  const [stats, setStats] = useState<CmsStats | null>(null);
  const [posts, setPosts] = useState<CmsPost[]>([]);
  const [categories, setCategories] = useState<CmsCategory[]>([]);
  const [tags, setTags] = useState<CmsTag[]>([]);
  const [media, setMedia] = useState<CmsMedia[]>([]);
  const [users, setUsers] = useState<CmsUser[]>([]);
  const [settings, setSettings] = useState<CmsSetting[]>([]);

  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [postForm, setPostForm] = useState<PostFormState>(defaultPostForm);

  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "", description: "" });
  const [tagForm, setTagForm] = useState({ name: "", slug: "" });
  const [mediaForm, setMediaForm] = useState({ title: "", url: "", altText: "", mimeType: "", sizeBytes: "" });
  const [userForm, setUserForm] = useState({ name: "", email: "", roles: "editor", active: true });
  const [settingForm, setSettingForm] = useState({ keyName: "", value: "", groupName: "general" });

  const tabs: Array<{ id: TabKey; label: string }> = [
    { id: "dashboard", label: "Dashboard" },
    { id: "posts", label: "Posts" },
    { id: "taxonomy", label: "Categorias e Tags" },
    { id: "media", label: "Midia" },
    { id: "users", label: "Usuarios" },
    { id: "settings", label: "Configuracoes" },
  ];

  const statCards = useMemo(
    () => [
      { label: "Posts", value: stats?.posts ?? 0 },
      { label: "Publicados", value: stats?.publishedPosts ?? 0 },
      { label: "Categorias", value: stats?.categories ?? 0 },
      { label: "Tags", value: stats?.tags ?? 0 },
      { label: "Midia", value: stats?.media ?? 0 },
      { label: "Usuarios", value: stats?.users ?? 0 },
      { label: "Settings", value: stats?.settings ?? 0 },
    ],
    [stats]
  );

  const loadAll = async () => {
    setLoading(true);
    setNotice("");

    try {
      const [statsData, postsData, categoriesData, tagsData, mediaData, usersData, settingsData] = await Promise.all([
        apiRequest("/api/admin/cms/stats"),
        apiRequest("/api/admin/cms/posts"),
        apiRequest("/api/admin/cms/categories"),
        apiRequest("/api/admin/cms/tags"),
        apiRequest("/api/admin/cms/media"),
        apiRequest("/api/admin/cms/users"),
        apiRequest("/api/admin/cms/settings"),
      ]);

      setStats(statsData.stats || null);
      setPosts(postsData.items || []);
      setCategories(categoriesData.items || []);
      setTags(tagsData.items || []);
      setMedia(mediaData.items || []);
      setUsers(usersData.items || []);
      setSettings(settingsData.items || []);
    } catch (error) {
      setNotice(`Erro ao carregar CMS: ${error instanceof Error ? error.message : "unknown"}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const resetPostForm = () => {
    setEditingPostId(null);
    setPostForm(defaultPostForm);
  };

  const submitPost = async () => {
    if (!postForm.title.trim() || !postForm.content.trim()) {
      setNotice("Preencha titulo e conteudo do post.");
      return;
    }

    setSaving(true);
    setNotice("");

    try {
      const payload = {
        title: postForm.title,
        slug: postForm.slug || undefined,
        excerpt: postForm.excerpt || undefined,
        content: postForm.content,
        status: postForm.status,
        authorUserId: postForm.authorUserId ? Number(postForm.authorUserId) : undefined,
        categoryIds: postForm.categoryIds,
        tagIds: postForm.tagIds,
      };

      if (editingPostId) {
        await apiRequest(`/api/admin/cms/posts/${editingPostId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setNotice("Post atualizado.");
      } else {
        await apiRequest("/api/admin/cms/posts", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setNotice("Post criado.");
      }

      resetPostForm();
      await loadAll();
    } catch (error) {
      setNotice(`Falha ao salvar post: ${error instanceof Error ? error.message : "unknown"}`);
    } finally {
      setSaving(false);
    }
  };

  const startEditPost = (post: CmsPost) => {
    setTab("posts");
    setEditingPostId(post.id);
    setPostForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      status: post.status,
      authorUserId: post.authorUserId ? String(post.authorUserId) : "",
      categoryIds: post.categories.map((item) => item.id),
      tagIds: post.tags.map((item) => item.id),
    });
  };

  const deletePost = async (id: number) => {
    const confirmed = window.confirm("Excluir este post?");
    if (!confirmed) return;

    try {
      await apiRequest(`/api/admin/cms/posts/${id}`, { method: "DELETE" });
      if (editingPostId === id) resetPostForm();
      setNotice("Post removido.");
      await loadAll();
    } catch (error) {
      setNotice(`Falha ao remover post: ${error instanceof Error ? error.message : "unknown"}`);
    }
  };

  const createCategory = async () => {
    if (!categoryForm.name.trim()) return setNotice("Informe o nome da categoria.");

    setSaving(true);
    try {
      await apiRequest("/api/admin/cms/categories", {
        method: "POST",
        body: JSON.stringify(categoryForm),
      });
      setCategoryForm({ name: "", slug: "", description: "" });
      setNotice("Categoria criada.");
      await loadAll();
    } catch (error) {
      setNotice(`Erro ao criar categoria: ${error instanceof Error ? error.message : "unknown"}`);
    } finally {
      setSaving(false);
    }
  };

  const createTag = async () => {
    if (!tagForm.name.trim()) return setNotice("Informe o nome da tag.");

    setSaving(true);
    try {
      await apiRequest("/api/admin/cms/tags", {
        method: "POST",
        body: JSON.stringify(tagForm),
      });
      setTagForm({ name: "", slug: "" });
      setNotice("Tag criada.");
      await loadAll();
    } catch (error) {
      setNotice(`Erro ao criar tag: ${error instanceof Error ? error.message : "unknown"}`);
    } finally {
      setSaving(false);
    }
  };

  const createMedia = async () => {
    if (!mediaForm.title.trim() || !mediaForm.url.trim()) return setNotice("Informe titulo e URL da midia.");

    setSaving(true);
    try {
      await apiRequest("/api/admin/cms/media", {
        method: "POST",
        body: JSON.stringify({
          ...mediaForm,
          sizeBytes: mediaForm.sizeBytes.trim() ? Number(mediaForm.sizeBytes) : undefined,
        }),
      });
      setMediaForm({ title: "", url: "", altText: "", mimeType: "", sizeBytes: "" });
      setNotice("Midia adicionada.");
      await loadAll();
    } catch (error) {
      setNotice(`Erro ao adicionar midia: ${error instanceof Error ? error.message : "unknown"}`);
    } finally {
      setSaving(false);
    }
  };

  const createUser = async () => {
    if (!userForm.name.trim() || !userForm.email.trim()) return setNotice("Informe nome e email do usuario.");

    setSaving(true);
    try {
      await apiRequest("/api/admin/cms/users", {
        method: "POST",
        body: JSON.stringify({
          name: userForm.name,
          email: userForm.email,
          active: userForm.active,
          roles: userForm.roles
            .split(",")
            .map((role) => role.trim())
            .filter(Boolean),
        }),
      });
      setUserForm({ name: "", email: "", roles: "editor", active: true });
      setNotice("Usuario criado.");
      await loadAll();
    } catch (error) {
      setNotice(`Erro ao criar usuario: ${error instanceof Error ? error.message : "unknown"}`);
    } finally {
      setSaving(false);
    }
  };

  const saveSetting = async () => {
    if (!settingForm.keyName.trim()) return setNotice("Informe a chave da configuracao.");

    setSaving(true);
    try {
      await apiRequest("/api/admin/cms/settings", {
        method: "POST",
        body: JSON.stringify(settingForm),
      });
      setSettingForm({ keyName: "", value: "", groupName: "general" });
      setNotice("Configuracao salva.");
      await loadAll();
    } catch (error) {
      setNotice(`Erro ao salvar configuracao: ${error instanceof Error ? error.message : "unknown"}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_5%,rgba(14,165,233,0.22),transparent_35%),radial-gradient(circle_at_90%_5%,rgba(16,185,129,0.16),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.12),transparent_32%)]" />

      <header className="relative border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-200">Admin CMS</p>
            <h1 className="text-lg font-bold">Content Management</h1>
          </div>
          <div className="flex items-center gap-2">
            <a href="/admin/dashboard" className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10">
              Dashboard
            </a>
            <a href="/api/auth/logout" className="rounded-lg border border-rose-300/20 bg-rose-600 px-3 py-2 text-sm font-semibold hover:bg-rose-500">
              Sair
            </a>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`rounded-full border px-3 py-1.5 text-sm ${tab === item.id ? "border-cyan-300/60 bg-cyan-400/20" : "border-white/20 bg-black/20 hover:bg-white/10"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button type="button" onClick={loadAll} disabled={loading} className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10">
            {loading ? "Atualizando..." : "Atualizar dados"}
          </button>
        </div>

        {notice && <p className="mb-4 rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-100">{notice}</p>}

        {tab === "dashboard" && (
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => (
              <article key={card.label} className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-300">{card.label}</p>
                <p className="mt-2 text-3xl font-black text-cyan-200">{card.value}</p>
              </article>
            ))}
          </section>
        )}

        {tab === "posts" && (
          <section className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold">{editingPostId ? "Editar post" : "Novo post"}</h2>
                {editingPostId && (
                  <button type="button" onClick={resetPostForm} className="rounded-lg border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10">
                    Cancelar edicao
                  </button>
                )}
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                <input
                  value={postForm.title}
                  onChange={(e) => setPostForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Titulo"
                  className="rounded-lg border border-white/20 bg-[#070d1b] px-3 py-2 text-sm"
                />
                <input
                  value={postForm.slug}
                  onChange={(e) => setPostForm((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="Slug (opcional)"
                  className="rounded-lg border border-white/20 bg-[#070d1b] px-3 py-2 text-sm"
                />
                <input
                  value={postForm.excerpt}
                  onChange={(e) => setPostForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Resumo"
                  className="rounded-lg border border-white/20 bg-[#070d1b] px-3 py-2 text-sm md:col-span-2"
                />
                <select
                  value={postForm.status}
                  onChange={(e) => setPostForm((prev) => ({ ...prev, status: e.target.value as "draft" | "published" }))}
                  className="rounded-lg border border-white/20 bg-[#070d1b] px-3 py-2 text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                <select
                  value={postForm.authorUserId}
                  onChange={(e) => setPostForm((prev) => ({ ...prev, authorUserId: e.target.value }))}
                  className="rounded-lg border border-white/20 bg-[#070d1b] px-3 py-2 text-sm"
                >
                  <option value="">Autor (opcional)</option>
                  {users.map((user) => (
                    <option key={user.id} value={String(user.id)}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="mb-2 text-sm font-semibold">Categorias</p>
                  <div className="max-h-32 space-y-1 overflow-y-auto text-sm">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={postForm.categoryIds.includes(category.id)}
                          onChange={(e) =>
                            setPostForm((prev) => ({
                              ...prev,
                              categoryIds: e.target.checked
                                ? [...prev.categoryIds, category.id]
                                : prev.categoryIds.filter((id) => id !== category.id),
                            }))
                          }
                        />
                        {category.name}
                      </label>
                    ))}
                    {categories.length === 0 && <p className="text-slate-300">Sem categorias.</p>}
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="mb-2 text-sm font-semibold">Tags</p>
                  <div className="max-h-32 space-y-1 overflow-y-auto text-sm">
                    {tags.map((tag) => (
                      <label key={tag.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={postForm.tagIds.includes(tag.id)}
                          onChange={(e) =>
                            setPostForm((prev) => ({
                              ...prev,
                              tagIds: e.target.checked ? [...prev.tagIds, tag.id] : prev.tagIds.filter((id) => id !== tag.id),
                            }))
                          }
                        />
                        {tag.name}
                      </label>
                    ))}
                    {tags.length === 0 && <p className="text-slate-300">Sem tags.</p>}
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <p className="mb-2 text-sm font-semibold">Editor rich text</p>
                <RichEditor value={postForm.content} onChange={(content) => setPostForm((prev) => ({ ...prev, content }))} />
              </div>

              <button
                type="button"
                onClick={submitPost}
                disabled={saving}
                className="mt-3 rounded-lg border border-cyan-300/50 bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
              >
                {saving ? "Salvando..." : editingPostId ? "Atualizar post" : "Criar post"}
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/20">
              <table className="min-w-full text-sm">
                <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.16em] text-slate-300">
                  <tr>
                    <th className="px-3 py-2">Titulo</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Categorias</th>
                    <th className="px-3 py-2">Atualizado</th>
                    <th className="px-3 py-2">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-t border-white/10">
                      <td className="px-3 py-2">
                        <p className="font-semibold">{post.title}</p>
                        <p className="text-xs text-slate-300">/{post.slug}</p>
                      </td>
                      <td className="px-3 py-2">{post.status}</td>
                      <td className="px-3 py-2">{post.categories.map((item) => item.name).join(", ") || "-"}</td>
                      <td className="px-3 py-2">{new Date(post.updatedAt).toLocaleString("pt-BR")}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2">
                          <button type="button" onClick={() => startEditPost(post)} className="rounded border border-white/20 px-2 py-1 hover:bg-white/10">
                            Editar
                          </button>
                          <button type="button" onClick={() => deletePost(post.id)} className="rounded border border-rose-300/40 px-2 py-1 text-rose-200 hover:bg-rose-500/10">
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {posts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-3 py-4 text-center text-slate-300">
                        Nenhum post cadastrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === "taxonomy" && (
          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <h2 className="mb-3 text-lg font-bold">Categorias</h2>
              <div className="grid gap-2">
                <input
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome"
                  className="rounded-lg border border-white/20 bg-[#070d1b] px-3 py-2 text-sm"
                />
                <input
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="Slug"
                  className="rounded-lg border border-white/20 bg-[#070d1b] px-3 py-2 text-sm"
                />
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Descricao"
                  rows={3}
                  className="rounded-lg border border-white/20 bg-[#070d1b] px-3 py-2 text-sm"
                />
                <button type="button" onClick={createCategory} className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10">
                  Criar categoria
                </button>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                {categories.map((category) => (
                  <div key={category.id} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                    <p className="font-semibold">{category.name}</p>
                    <p className="text-xs text-slate-300">/{category.slug}</p>
                  </div>
                ))}
                {categories.length === 0 && <p className="text-slate-300">Sem categorias.</p>}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <h2 className="mb-3 text-lg font-bold">Tags</h2>
              <div className="grid gap-2">
                <input
                  value={tagForm.name}
                  onChange={(e) => setTagForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome"
                  className="rounded-lg border border-white/20 bg-[#070d1b] px-3 py-2 text-sm"
                />
                <input
                  value={tagForm.slug}
                  onChange={(e) => setTagForm((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="Slug"
                  className="rounded-lg border border-white/20 bg-[#070d1b] px-3 py-2 text-sm"
                />
                <button type="button" onClick={createTag} className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10">
                  Criar tag
                </button>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                {tags.map((item) => (
                  <div key={item.id} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-slate-300">/{item.slug}</p>
                  </div>
                ))}
                {tags.length === 0 && <p className="text-slate-300">Sem tags.</p>}
              </div>
            </div>
          </section>
        )}

        {tab === "media" && (
          <section className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <h2 className="mb-3 text-lg font-bold">Biblioteca de Midia</h2>
              <div className="grid gap-2 md:grid-cols-2">
                <input
                  value={mediaForm.title}
                  onChange={(e) => setMediaForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Titulo"
                  className="rounded-lg border border-white/20 bg-[#070d1b] px-3 py-2 text-sm"
                />
                <input
                  value={mediaForm.url}
                  onChange={(e) => setMediaForm((prev) => ({ ...prev, url: e.target.value }))}
                  placeholder="URL"
                  className="rounded-lg border border-white/20 bg-[#070d1b] px-3 py-2 text-sm"
                />
                <input
                  value={mediaForm.altText}
                  onChange={(e) => setMediaForm((prev) => ({ ...prev, altText: e.target.value }))}
                  placeholder="Alt text"
                  className="rounded-lg border border-white/20 bg-[#070d1b] px-3 py-2 text-sm"
                />
                <input
                  value={mediaForm.mimeType}
                  onChange={(e) => setMediaForm((prev) => ({ ...prev, mimeType: e.target.value }))}
                  placeholder="Mime type"
                  className="rounded-lg border border-white/20 bg-[#070d1b] px-3 py-2 text-sm"
                />
                <input
                  value={mediaForm.sizeBytes}
                  onChange={(e) => setMediaForm((prev) => ({ ...prev, sizeBytes: e.target.value }))}
                  placeholder="Tamanho em bytes"
                  className="rounded-lg border border-white/20 bg-[#070d1b] px-3 py-2 text-sm"
                />
              </div>
              <button type="button" onClick={createMedia} className="mt-3 rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10">
                Adicionar midia
              </button>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {media.map((item) => (
                <article key={item.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="font-semibold">{item.title}</p>
                  <a href={item.url} target="_blank" rel="noreferrer" className="mt-1 block truncate text-xs text-cyan-200 underline">
                    {item.url}
                  </a>
                  <p className="mt-1 text-xs text-slate-300">{item.mimeType || "desconhecido"}</p>
                </article>
              ))}
              {media.length === 0 && <p className="text-slate-300">Sem arquivos de midia.</p>}
            </div>
          </section>
        )}

        {tab === "users" && (
          <section className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <h2 className="mb-3 text-lg font-bold">Usuarios e Permissoes</h2>
              <div className="grid gap-2 md:grid-cols-2">
                <input
                  value={userForm.name}
                  onChange={(e) => setUserForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome"
                  className="rounded-lg border border-white/20 bg-[#070d1b] px-3 py-2 text-sm"
                />
                <input
                  value={userForm.email}
                  onChange={(e) => setUserForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Email"
                  className="rounded-lg border border-white/20 bg-[#070d1b] px-3 py-2 text-sm"
                />
                <input
                  value={userForm.roles}
                  onChange={(e) => setUserForm((prev) => ({ ...prev, roles: e.target.value }))}
                  placeholder="Roles (admin,editor,author)"
                  className="rounded-lg border border-white/20 bg-[#070d1b] px-3 py-2 text-sm"
                />
                <label className="flex items-center gap-2 rounded-lg border border-white/20 bg-[#070d1b] px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    checked={userForm.active}
                    onChange={(e) => setUserForm((prev) => ({ ...prev, active: e.target.checked }))}
                  />
                  Ativo
                </label>
              </div>
              <button type="button" onClick={createUser} className="mt-3 rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10">
                Criar usuario
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/20">
              <table className="min-w-full text-sm">
                <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.16em] text-slate-300">
                  <tr>
                    <th className="px-3 py-2">Nome</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Roles</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t border-white/10">
                      <td className="px-3 py-2">{user.name}</td>
                      <td className="px-3 py-2">{user.email}</td>
                      <td className="px-3 py-2">{user.roles.join(", ") || "-"}</td>
                      <td className="px-3 py-2">{user.active ? "ativo" : "inativo"}</td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-3 py-4 text-center text-slate-300">
                        Nenhum usuario cadastrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === "settings" && (
          <section className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <h2 className="mb-3 text-lg font-bold">Site Settings</h2>
              <div className="grid gap-2 md:grid-cols-2">
                <input
                  value={settingForm.keyName}
                  onChange={(e) => setSettingForm((prev) => ({ ...prev, keyName: e.target.value }))}
                  placeholder="Chave"
                  className="rounded-lg border border-white/20 bg-[#070d1b] px-3 py-2 text-sm"
                />
                <input
                  value={settingForm.groupName}
                  onChange={(e) => setSettingForm((prev) => ({ ...prev, groupName: e.target.value }))}
                  placeholder="Grupo"
                  className="rounded-lg border border-white/20 bg-[#070d1b] px-3 py-2 text-sm"
                />
                <textarea
                  value={settingForm.value}
                  onChange={(e) => setSettingForm((prev) => ({ ...prev, value: e.target.value }))}
                  placeholder="Valor"
                  rows={4}
                  className="rounded-lg border border-white/20 bg-[#070d1b] px-3 py-2 text-sm md:col-span-2"
                />
              </div>
              <button type="button" onClick={saveSetting} className="mt-3 rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10">
                Salvar configuracao
              </button>
            </div>

            <div className="space-y-2">
              {settings.map((setting) => (
                <article key={setting.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">{setting.keyName}</p>
                    <span className="rounded-full border border-white/20 px-2 py-0.5 text-xs text-slate-300">{setting.groupName}</span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm text-slate-100">{setting.value}</p>
                  <p className="mt-1 text-xs text-slate-400">Atualizado: {new Date(setting.updatedAt).toLocaleString("pt-BR")}</p>
                </article>
              ))}
              {settings.length === 0 && <p className="text-slate-300">Nenhuma configuracao cadastrada.</p>}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
