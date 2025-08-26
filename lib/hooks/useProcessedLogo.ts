import { useEffect, useState } from 'react';
import { ensureSameOriginImage } from 'lib/urls';
import { blobToDataURL, invertImageColors } from 'lib/images';
import { removeImageBackground } from 'lib/removeBg';
import { toast } from 'components/ToastProvider';

interface Options {
  logoFile?: Blob;
  logoUrl?: string;
  removeLogoBg: boolean;
  invertLogo: boolean;
}

export default function useProcessedLogo({
  logoFile,
  logoUrl,
  removeLogoBg,
  invertLogo,
}: Options) {
  const [logoDataUrl, setLogoDataUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    const process = async () => {
      let source: string | Blob | undefined = logoFile ?? logoUrl;
      if (!source) {
        setLogoDataUrl(undefined);
        return;
      }

      try {
        if (removeLogoBg) {
          source = await removeImageBackground(source);
        }

        let normalized: string;
        if (source instanceof Blob) {
          normalized = await blobToDataURL(source);
        } else {
          normalized = ensureSameOriginImage(source)!;
        }

        if (invertLogo) {
          normalized = await invertImageColors(normalized);
        }

        if (!cancelled) setLogoDataUrl(normalized);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Erro ao processar a imagem.';
        toast({ message, variant: 'error' });
        if (!cancelled) setLogoDataUrl(undefined);
      }
    };

    process();
    return () => {
      cancelled = true;
    };
  }, [logoFile, logoUrl, removeLogoBg, invertLogo]);

  return logoDataUrl;
}

