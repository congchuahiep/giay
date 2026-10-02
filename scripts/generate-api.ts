/**
 * Sinh type client từ contract OpenAPI.
 *
 * Nguồn contract (chọn 1):
 *  - URL server đang chạy: OPENAPI_SPEC_URL=http://localhost:8000/api-docs/openapi.json
 *  - File openapi.json đã dump: `cargo test -p giay-api dump_openapi` (server) rồi
 *    trỏ OPENAPI_SPEC_URL tới file đó.
 *
 * Mặc định là URL server ở localhost:8080.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import openapiTS, { astToString } from "openapi-typescript";

const source =
	process.env.OPENAPI_SPEC_URL ?? "http://localhost:8000/api-docs/openapi.json";
const output = "src/api/generated/schema.d.ts";

const isHttpUrl = source.startsWith("http://") || source.startsWith("https://");
const content = isHttpUrl
	? await (await fetch(source)).text()
	: await readFile(path.resolve(source), "utf-8");

const ast = await openapiTS(content);
const contents = astToString(ast);

mkdirSync(path.dirname(output), { recursive: true });
writeFileSync(output, contents);
console.log("Sinh type client thành công");
