// @ts-ignore
import { createClient as _ } from "npm:redis@4";
import { bar } from "../bar/mod.ts";
import { baz } from "../baz/mod.ts";

bar();
baz();
