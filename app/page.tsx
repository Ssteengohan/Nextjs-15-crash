import Link from "next/link";
import Hello from "./components/hello";

export default function Home() {
  return (
    <>
    <h1 className="text-3xl">Welcome to Next.js</h1>
    <Hello />    

    <li>
      <Link href="/work/1">
        Hello
      </Link>
    </li>
    <li>
      <Link href="/work/2">
        Hello
      </Link>
    </li>
    </>
  );
}
