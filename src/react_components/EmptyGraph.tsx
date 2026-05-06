import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
export function EmptyGraph() {
    return (

        <Empty className="border border-dashed" style={{ width: '100%', height: '100%', maxWidth: 'none', maxHeight: 'none' }}>
            <EmptyHeader>
                <EmptyTitle>No Graph to Display</EmptyTitle>
                <EmptyDescription>
                    Enter a valid GitHub repository URL and click "Search" to see the connections between each file.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
}