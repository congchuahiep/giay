import * as v from "valibot";

const EnvSchema = v.object({
	SERVER_API_URL: v.string(),
});

const createEnv = () => {
	const raw = {
		SERVER_API_URL: import.meta.env.SERVER_API_URL,
	};

	const parsed = v.safeParse(EnvSchema, raw);

	if (!parsed.success) {
		throw new Error(
			`Invalid env. Missing or invalid variables:\n${parsed.issues
				.map((issue) => {
					const key = issue.path?.[0]?.key ?? "Unknown key";
					return `  - ${key}: ${issue.message}`;
				})
				.join("\n")}`,
		);
	}

	return parsed.output;
};

export const env = createEnv();
