import { reviews } from '../data'
import { motionTokens } from '../lib/motion'
import { Icon } from './Icon'
import { Accent, Container, Reveal, SectionHeading } from './ui'

// Reviews styled as chat bubbles to echo the hero conversation
export function Reviews() {
  return (
    <section id="reviews" className="py-16 lg:py-24" aria-labelledby="reviews-title">
      <Container>
        <Reveal>
          <SectionHeading
            id="reviews-title"
            eyebrow="Отзывы"
            title={
              <>
                Сани, которые <Accent>теперь в порядке</Accent>
              </>
            }
          />
        </Reveal>

        <ul className="mt-10 grid gap-8 md:grid-cols-3 lg:mt-14">
          {reviews.map((review, index) => (
            <Reveal as="li" key={review.name} delay={index * motionTokens.stagger}>
              <figure>
                <blockquote
                  className={`relative rounded-[1.75rem] rounded-bl-md p-6 text-lg leading-relaxed ${
                    index === 1 ? 'bg-violet text-white' : 'bg-white ring-1 ring-ink/5'
                  }`}
                >
                  <p className="mb-3 flex gap-0.5 text-sun" role="img" aria-label="Оценка 5 из 5">
                    {Array.from({ length: 5 }, (_, star) => (
                      <Icon key={star} name="star" className="size-5" />
                    ))}
                  </p>
                  {review.text}
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3 pl-2">
                  <span className="grid size-10 place-items-center rounded-full bg-lime font-extrabold">{review.name[0]}</span>
                  <span className="font-bold">{review.name}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}
