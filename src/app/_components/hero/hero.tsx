import HeroCharacters from "./_components/hero-characters"
import HeroChart from "./_components/hero-chart"
import HeroContent from "./_components/hero-content"

export default function Hero() {
  return (
    <div className="mx-auto max-w-2xl py-20 lg:max-w-5xl lg:py-56">
      <div className="grid grid-cols-1 items-center gap-y-8 lg:grid-cols-[1fr_min-content] lg:gap-x-12">
        <HeroContent />
        <div className="relative w-[500px] justify-self-center rounded-lg bg-background">
          <HeroChart />
          <HeroCharacters />
        </div>
      </div>
    </div>
  )
}
