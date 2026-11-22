import { CategoryShowcase } from '../components/home/CategoryShowcase'
import { FeaturedSection } from '../components/home/FeaturedSection'
import { HomeHero } from '../components/home/HomeHero'
import { MissionSection } from '../components/home/MissionSection'
import { useFeaturedListings } from '../hooks/useFeaturedListings'
import { useAppSelector } from '../redux/hooks'
import { selectCategorySummaries } from '../redux/slices/listingsSlice'

/** HOME: the page owns data access; sections are presentational. */
export function Home() {
  const featured = useFeaturedListings()
  const categories = useAppSelector(selectCategorySummaries)

  return (
    <>
      <HomeHero />
      <CategoryShowcase
        categories={categories}
        showCounts={!featured.isLoading && !featured.error}
      />
      <FeaturedSection {...featured} />
      <MissionSection />
    </>
  )
}
