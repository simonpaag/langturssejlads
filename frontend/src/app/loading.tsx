import AnimatedLoader from '@/components/AnimatedLoader';

export default function Loading() {
    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-background">
            <AnimatedLoader className="scale-125" />
        </div>
    );
}
