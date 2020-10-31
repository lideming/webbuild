export default function cssLoader() {
    return {
        name: 'css-loader',
        transform(code: string, id: string): any {
            if (id.endsWith('.css')) {
                return {
                    code: 'export default ' + JSON.stringify(code),
                    map: { mappings: '' }
                };
            }
        }
    };
}