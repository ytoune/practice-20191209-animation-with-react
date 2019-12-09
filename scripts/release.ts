import { join } from 'path'
import { readFile, writeFile } from 'fs-extra'
import { publish as publish2git } from 'gh-pages'

const resolve = (...s: string[]) => join(__dirname, '..', ...s)

type Info = Record<string | number, unknown>
type Resolve = (...parts: string[]) => string

type Context = {
	info: Info
	resolve: Resolve
	outdir: string
	version: string
}

const main = async () => {
	const info = await readPackageJson(resolve)
	const { name, version } = info
	if ('string' !== typeof name) throw new Error('name must be string')
	if ('string' !== typeof version) throw new Error('version must be string')

	const context: Context = { info, resolve, version, outdir: 'dist' }

	await copyPackageJson(context)
	await copyReadme(context)

	await publishDir(context)

	console.log('done!')
}

const readPackageJson = async (resolve: Resolve): Promise<Info> => {
	const json = JSON.parse(await readFile(resolve('package.json'), 'utf8'))
	if ('object' === typeof json && json) return json
	return {}
}

const copyPackageJson = async ({ resolve, info, outdir }: Context) => {
	const {
		name,
		description,
		version,
		author,
		license,
		private: private_,
		engines,
		dependencies,
		main,
		bin,
	} = info

	const packagerow = JSON.stringify(
		{
			name,
			description,
			version,
			main,
			bin,
			engines,
			dependencies,
			author,
			private: private_,
			license,
		},
		null,
		2,
	)

	await writeFile(resolve(outdir, 'package.json'), packagerow, 'utf8')
}

const copyReadme = async ({ resolve, outdir, version }: Context) => {
	const content = await readFile(resolve('README.md'), 'utf8')
	const majorVersion = getMajorVersion(version)
	const pattern =
		majorVersion !== version ? 'semver:v' + majorVersion : 'v' + version
	const fixedContent = content.replace(/\$VERSION/gu, pattern)
	await writeFile(resolve(outdir, 'README.md'), fixedContent, 'utf8')
}

const getMajorVersion = (version: string) => {
	const r = /^(\d+)\.\d+\.\d+$/u.exec(version)
	return r ? `${r[1]}.x` : version
}

const publishDir = async ({ resolve, outdir, version }: Context) => {
	await new Promise((r, j) =>
		publish2git(
			resolve(outdir),
			{
				user: {
					email: 'tone@re-knock.io',
					name: 'publisher',
				},
				branch: 'release',
				dotfiles: true,
				message: `Release v${version}!!`,
				tag: `v${version}`,
			},
			e => (e ? j(e) : r()),
		),
	)
}

main().catch(x => {
	console.error(x)
	process.exit(1)
})
