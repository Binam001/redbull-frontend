import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ATHLETES, getAthleteBySlug } from "@/constants/athletes";
import AthleteDetailView from "@/components/athletes/AthleteDetailView";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return ATHLETES.map((athlete) => ({
        slug: athlete.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const athlete = getAthleteBySlug(slug);

    if (!athlete) {
        return {
            title: "Athlete Not Found | Red Bull",
        };
    }

    return {
        title: `${athlete.name} | ${athlete.displayTitle} - Red Bull Athletes`,
        description: athlete.description,
        openGraph: {
            title: `${athlete.name} | Red Bull Athlete`,
            description: athlete.description,
            images: [{ url: athlete.hoverImage }],
        },
    };
}

export default async function AthleteDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const athlete = getAthleteBySlug(slug);

    if (!athlete) {
        notFound();
    }

    return (
        <main className="relative min-h-screen ">
            <AthleteDetailView athlete={athlete} />
        </main>
    );
}
