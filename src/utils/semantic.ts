export function prepareText(text: string): string {
  // PRD F3: Text Preparation
  // - trim leading and trailing whitespace
  // - normalize repeated whitespace
  // - punctuation should remain
  if (!text) return '';
  return text.trim().replace(/\s+/g, ' ');
}

export async function fetchSemanticScore(baselineText: string, currentText: string): Promise<number> {
  const baseline = prepareText(baselineText);
  const current = prepareText(currentText);

  if (baseline === current) return 1.0;

  try {
    // 환경 변수(Vite)에서 URL을 가져오며, 지정되지 않은 경우 로컬호스트를 기본값으로 사용합니다.
    const workerUrl = import.meta.env.VITE_WORKER_URL || 'http://localhost:8787';

    const response = await fetch(workerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        baselineText: baseline,
        currentText: current
      })
    });

    if (!response.ok) {
      throw new Error(`Worker responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.ok && typeof data.semanticScore === 'number') {
      // Worker에서 이미 Threshold(0.35) 보정 처리가 된 최종 점수(semanticScore) 반환
      return data.semanticScore;
    }

    return 0;
  } catch (error) {
    console.error("Failed to fetch semantic score:", error);
    // 에러 발생 혹은 실패 시 점수를 유지하거나 unavailable 처리 (여기선 0 리턴, 플러그인에서 prevScore fallback 처리됨)
    throw error;
  }
}
