import { MaterialLink } from '../types/IPreparation';

export const parseMaterialLinks = (materialLinks: string[]): MaterialLink[] =>
    materialLinks.map((item) => {
        const match = item.match(/title\s*-\s*(.*?)\.?\s*description\s*-\s*(.*?)\.?\s*link\s*-\s*(.+)/i);

        if (!match) {
            throw new Error(`Invalid format: ${item}`);
        }

        return {
            title: match[1].trim(),
            description: match[2].trim(),
            link: match[3].trim(),
        };
    });
