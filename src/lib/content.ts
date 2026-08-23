import { supabase } from "./supabase";

/** Fixed set of editable text fields, keyed to `data-content-key` attributes in the public components. */
export const CONTENT_FIELDS: { key: string; label: string; multiline?: boolean; default: string }[] = [
  { key: "hero_title_line1", label: "Hero — título línea 1", default: "Hey There," },
  { key: "hero_title_line2", label: "Hero — título línea 2", default: "I'm Johan." },
  { key: "hero_subtitle", label: "Hero — subtítulo", multiline: true, default: "I weave code with art and functionality, transforming ideas into captivating digital experiences." },
  { key: "hero_role", label: "Hero — rol", default: "FullStack Developer" },
  { key: "hero_years", label: "Hero — años de experiencia", default: "2" },
  { key: "stats_projects_count", label: "Stat — proyectos completados", default: "5+" },
  { key: "stats_clients_count", label: "Stat — clientes felices", default: "3+" },
  { key: "whatido_p1", label: "What I do — párrafo 1", multiline: true, default: "I'm a web developer dedicated to creating digital experiences that are not only clear and accessible, but also engaging and functional for everyone." },
  { key: "whatido_p2", label: "What I do — párrafo 2", multiline: true, default: "My goal is to simplify the complexity of the digital world, offering websites that anyone can navigate with ease." },
];

/** Fetches all content rows and writes matching values into every [data-content-key] element on the page. */
export async function hydrateContent() {
  const { data, error } = await supabase.from("content").select("key, value");
  if (error || !data) return;
  const map = new Map(data.map((row) => [row.key, row.value as string]));
  document.querySelectorAll<HTMLElement>("[data-content-key]").forEach((el) => {
    const value = map.get(el.dataset.contentKey!);
    if (value) el.textContent = value;
  });
}
