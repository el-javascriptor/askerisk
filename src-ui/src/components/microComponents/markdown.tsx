import styles from "./markdown.module.css"

interface ProcessedMarkdownProps {
    text: string
}

export function ProcessedMarkdown({ text }: ProcessedMarkdownProps) {

    const matches = text.matchAll(/\*[a-zA-Z0-9][^\*]*\*/gi);

    const items = []
    let currentIndex = 0;

    for (const match of matches) {

        items.push(<span key={currentIndex * 2}>{text.substring(currentIndex, match.index)}</span>);
        items.push(<b key={currentIndex * 2 + 1}>{match[0].slice(1, -1)}</b>);

        currentIndex = match.index + match[0].length;

    }

    items.push(<span key={currentIndex * 2}>{text.substring(currentIndex)}</span>);

    return <div className={styles.text}>{items}</div>
}
