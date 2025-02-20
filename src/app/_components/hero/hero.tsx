import HeroCharacters from "./_components/hero-characters"
import HeroChart from "./_components/hero-chart"
import HeroContent from "./_components/hero-content"

export default function Hero() {
  return (
    <div className="mx-auto max-w-2xl py-10">
      <div className="flex flex-col items-center justify-center gap-y-10">
        <HeroCharacters />
        <HeroContent />
      </div>
    </div>
  )
}
