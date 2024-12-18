import { bar } from "../bar/mod.ts";
import { baz } from "../baz/mod.ts";
import { createClient as _ } from "npm:redis@4";

bar();
baz();
