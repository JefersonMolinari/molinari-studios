import type { CatalogItem } from './catalog';
import { instagramDmUrl } from './catalog';

const assetPath = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`;

type ProductGalleryProps = {
  items: CatalogItem[];
  customOrder: CatalogItem;
};

function ProductActions({ item }: { item: CatalogItem }) {
  return (
    <div className="product-actions">
      <a
        className="product-action product-action-primary"
        href={instagramDmUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`DM Molinari Studios on Instagram about ${item.title}`}
      >
        DM on Instagram <span aria-hidden="true">↗</span>
      </a>
      <a
        className="product-action product-action-secondary"
        href={item.sourceUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`View the original Instagram post for ${item.title}`}
      >
        View original post
      </a>
    </div>
  );
}

function ProductCard({ item, index }: { item: CatalogItem; index: number }) {
  return (
    <article className="product-card" data-catalog-kind="product">
      <div className="product-image-frame">
        <img
          className="product-image"
          src={assetPath(item.image)}
          alt={item.alt}
          loading="lazy"
          style={{
            objectFit: item.imageFit ?? 'cover',
            objectPosition: item.imagePosition ?? 'center',
          }}
        />
        <span className="product-number">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="product-copy">
        {item.note && <p className="product-note">{item.note}</p>}
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <ProductActions item={item} />
      </div>
    </article>
  );
}

export function ProductGallery({ items, customOrder }: ProductGalleryProps) {
  return (
    <section className="products-section section" id="products">
      <div className="shell">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Made by Molinari Studios</p>
            <h2>
              Objects made to <em>feel personal.</em>
            </h2>
          </div>
          <p className="section-lede">
            Useful details, expressive decor, and one-of-a-kind gifts—made to
            order and shaped around the people who will use them.
          </p>
        </div>

        <div className="products-grid">
          {items.map((item, index) => (
            <ProductCard key={item.slug} item={item} index={index} />
          ))}
        </div>

        <article
          className="custom-order-card"
          data-catalog-kind="custom-order"
        >
          <div className="custom-order-image-frame">
            <img
              className="product-image"
              src={assetPath(customOrder.image)}
              alt={customOrder.alt}
              loading="lazy"
              style={{
                objectFit: customOrder.imageFit ?? 'cover',
                objectPosition: customOrder.imagePosition ?? 'center',
              }}
            />
          </div>
          <div className="custom-order-copy">
            <p className="product-note">Custom order example</p>
            <h3>{customOrder.title}</h3>
            <p>{customOrder.description}</p>
            <ProductActions item={customOrder} />
          </div>
        </article>
      </div>
    </section>
  );
}
