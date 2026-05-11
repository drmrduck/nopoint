export function PlaceholderSlide({ title }: { title: string }) {
    return (
        <div className="flex h-full w-full items-center justify-center bg-zinc-950">
            <div className="text-center space-y-3">
                <div className="w-12 h-1 bg-blue-500/30 mx-auto rounded-full" />
                <p className="text-2xl font-bold text-white/20">{title}</p>
                <p className="text-sm text-white/15">Coming soon</p>
            </div>
        </div>
    )
}
