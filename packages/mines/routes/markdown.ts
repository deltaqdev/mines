import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from 'astro';
import { getDocs } from '../lib/docs';
import { markdownResponse, toMarkdown } from '../lib/markdown';

export const getStaticPaths = (async () => {
  const { entries } = await getDocs();
  return entries.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props> = ({ props }) => markdownResponse(toMarkdown(props.entry));
