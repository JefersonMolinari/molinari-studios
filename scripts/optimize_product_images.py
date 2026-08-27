from pathlib import Path
import sys

from PIL import Image, ImageOps


SLUGS = [
    "personalized-collectible",
    "custom-team-crest",
    "rattan-style-tray",
    "tissue-box-cover",
    "key-tray",
    "climber-wall-hooks",
    "tent-lamp",
    "martial-arts-display",
    "custom-event-medals",
]
MAX_EDGE = 1600
MAX_BYTES = 300 * 1024
MAX_TOTAL_BYTES = int(2.7 * 1024 * 1024)


def source_for(directory: Path, slug: str) -> Path:
    matches = [path for path in directory.glob(f"{slug}.*") if path.is_file()]
    if len(matches) != 1:
        raise SystemExit(f"expected one source image for {slug}, found {len(matches)}")
    return matches[0]


def validate_webp(target: Path) -> None:
    with Image.open(target) as encoded:
        encoded.verify()

    with Image.open(target) as encoded:
        if encoded.format != "WEBP":
            raise SystemExit(f"{target.name} is not a WebP image")
        if max(encoded.size) > MAX_EDGE:
            raise SystemExit(f"{target.name} exceeds the {MAX_EDGE}px edge limit")


def save_webp(image: Image.Image, target: Path) -> int:
    quality = 82
    while quality >= 64:
        image.save(target, "WEBP", quality=quality, method=6)
        if target.stat().st_size <= MAX_BYTES:
            validate_webp(target)
            return target.stat().st_size
        quality -= 3
    raise SystemExit(
        f"could not reduce {target.name} below 300 KB without dropping below quality 64"
    )


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("usage: optimize_product_images.py SOURCE_DIR OUTPUT_DIR")

    source_dir = Path(sys.argv[1])
    output_dir = Path(sys.argv[2])
    if not source_dir.is_dir():
        raise SystemExit(f"source directory does not exist: {source_dir}")

    output_dir.mkdir(parents=True, exist_ok=True)
    if source_dir.resolve() == output_dir.resolve():
        raise SystemExit("source and output directories must be different")

    total = 0
    for slug in SLUGS:
        with Image.open(source_for(source_dir, slug)) as opened:
            image = ImageOps.exif_transpose(opened).convert("RGB")
            image.thumbnail((MAX_EDGE, MAX_EDGE), Image.Resampling.LANCZOS)
            total += save_webp(image, output_dir / f"{slug}.webp")

    if total > MAX_TOTAL_BYTES:
        raise SystemExit(f"catalog media is {total} bytes; limit is {MAX_TOTAL_BYTES}")

    print(f"wrote {len(SLUGS)} images totaling {total} bytes")


if __name__ == "__main__":
    main()
