import fs from 'fs'
import { mergeContents } from '@expo/config-plugins/build/utils/generateCode'

async function readFileAsync(path: string): Promise<string> {
	return await fs.promises.readFile(path, 'utf8')
}

async function saveFileAsync(path: string, content: string): Promise<void> {
	await fs.promises.writeFile(path, content, 'utf8')
}

export async function mergeContentsAndSaveAsync(
	path: string,
	options: Omit<Parameters<typeof mergeContents>[0], 'src'>,
): Promise<void> {
	const { contents, didMerge } = mergeContents({
		...options,
		src: await readFileAsync(path),
	})

	if (didMerge) {
		await saveFileAsync(path, contents)
	}
}
