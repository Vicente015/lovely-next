import { PageProps } from "$fresh/server.ts";

export default function DocumentPage(props: PageProps) {
  return <div>{props.params.name}</div>;
}
