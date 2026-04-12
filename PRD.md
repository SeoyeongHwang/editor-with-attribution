### Product Requirements Document

### Product Name

Semantic Attribution Writing Editor

### Version

Draft 1

### Document Purpose

이 문서는 Semantic Attribution Writing Editor 전체 제품의 요구사항을 정의한다. 이 제품은 LLM 보조 글쓰기 상황에서 사용자가 텍스트를 생성, 수정, 비교, 저장하는 전체 흐름을 지원하는 웹 기반 에디터이며, 그 안에서 attribution cue는 핵심 기능 중 하나로 포함된다.

이 PRD의 목적은 구현 방법을 설명하는 것이 아니라, 제품이 무엇을 제공해야 하는지, 어떤 사용자 경험을 만들어야 하는지, 어떤 상태와 기능을 지원해야 하는지를 명확히 하는 것이다. 이 문서는 다른 에이전트가 설계, 구현, 분해 작업을 진행할 수 있을 정도의 기준 문서가 되는 것을 목표로 한다.

### Product Vision

이 제품은 단순한 AI 글쓰기 보조 도구가 아니라, 사용자가 LLM의 도움을 받아 글을 쓰되 자신의 저작성, 목소리, 수정 과정에 대한 감각을 유지할 수 있도록 돕는 에디터를 지향한다.

핵심 방향은 다음과 같다.

* 사용자가 에디터 안에서 직접 글을 작성하거나 LLM에게 도움을 요청할 수 있어야 한다.
* 사용자는 LLM이 생성한 텍스트를 그대로 쓰는 대신, 수정하고 비교하고 자기 방식으로 재구성할 수 있어야 한다.
* 시스템은 AI 텍스트의 흔적을 판정적으로 표시하는 대신, 사용자가 자신의 수정 과정을 성찰할 수 있도록 attribution cue를 제공해야 한다.
* 좌측 패널과 우측 패널을 통해 사용자는 각각 attribution 기준과 LLM 생성 요청을 독립적으로 다룰 수 있어야 한다.

### Product Summary

Semantic Attribution Writing Editor는 세 부분으로 구성된 웹 에디터이다.

* 중앙에는 실제 글을 쓰고 수정하는 메인 에디터가 있다.
* 좌측 패널에는 attribution cue와 관련된 설정, 해석 기준, 시각화 옵션이 있다.
* 우측 패널에는 LLM에게 텍스트 생성을 요청하고 결과를 받아오는 인터페이스가 있다.

이 제품은 다음 두 가지 큰 경험을 동시에 제공해야 한다.

* **Writing Support**: 사용자가 직접 쓰거나 LLM의 제안을 받아 글을 확장하고 발전시킨다.
* **Reflective Attribution Support**: 사용자가 현재 문장이 AI 원문과 어떤 관계에 있는지, 표면적으로 얼마나 바뀌었고 의미적으로 얼마나 가까운지를 돌아볼 수 있게 한다.

### Problem Statement

LLM을 활용한 글쓰기에서는 사용자가 AI가 생성한 텍스트를 수정하더라도, 그 수정이 실제로 어떤 수준의 변화인지를 파악하기 어렵다. 기존 diff 중심 표시는 표면적인 수정량은 보여줄 수 있지만, 의미 구조가 얼마나 유지되고 있는지는 드러내지 못한다. 반대로 의미적 유사성을 본다고 해도, 그것만으로 사용자가 실제로 많이 고쳤는지 알 수는 없다.

또한 기존 AI writing tools는 주로 텍스트 생성 자체에 집중하며, 사용자가 그 결과를 어떻게 자기 것으로 만들고 있는지를 인터페이스 차원에서 충분히 지원하지 못한다.

이 제품은 이 문제를 다음 방식으로 해결한다.

* 사용자가 AI 텍스트를 문서 안에 삽입하고 수정하는 전체 흐름을 지원한다.
* 수정 거리와 시맨틱 유사도라는 서로 다른 cue 기준을 제공한다.
* 사용자가 cue를 직접 선택·비교하며, 자신의 수정이 표면 편집인지 의미 재구성인지 성찰할 수 있게 한다.

### Target Users

#### Primary Users

* LLM을 활용해 글을 쓰는 학생, 연구자, 디자이너, 창작자
* AI가 생성한 텍스트를 그대로 쓰기보다, 자기 방식으로 수정하고 싶은 사용자
* authorship, agency, provenance 문제에 민감한 사용자

#### Secondary Users

* HCI, CSCW, AI-assisted writing 연구자
* attribution cue 또는 provenance UI를 실험하려는 연구·디자인 팀
* 창의적 글쓰기 및 reflective writing 도구를 탐구하는 프로덕트 디자이너

### Product Goals

#### Primary Goals

* 사용자가 한 화면 안에서 글쓰기, AI 요청, 수정, 비교를 모두 수행할 수 있어야 한다.
* 사용자가 AI 생성 텍스트를 문서에 적용하고 수정할 수 있어야 한다.
* 사용자가 attribution cue 기준을 선택하고 비교할 수 있어야 한다.
* 사용자가 표면 수정과 의미 유사성을 구분해서 볼 수 있어야 한다.

#### Secondary Goals

* 연구용 데모나 프로토타입으로 외부 사용자가 쉽게 접속해 시도할 수 있어야 한다.
* 나중에 LLM 종류, cue 기준, 시각화 방식이 확장 가능해야 한다.
* 저장 기능 없이도 단일 세션 수준에서 일관된 편집 경험을 제공해야 한다.

### Non-Goals

이 제품의 현재 목표에 포함되지 않는 것은 다음과 같다.

* 장기 문서 관리 시스템
* 협업 편집
* 자동 authorship 평가 또는 점수화
* plagiarism detection
* 완성도 평가 도구
* 사용자 계정 기반 장기 아카이빙
* 문서 공유 및 퍼블리싱 플랫폼

### Core Product Principles

#### 1. The editor is the core product surface

이 제품의 중심은 LLM 패널이나 cue 패널이 아니라 중앙 에디터여야 한다. 패널은 보조 기능이며, 글쓰기 영역이 중심이어야 한다.

#### 2. Cue is a reflective signal, not a judgment

attribution cue는 사용자를 평가하는 지표가 아니라, 사용자가 자신의 글쓰기 과정을 돌아보게 하는 신호여야 한다.

#### 3. Writing flow should not be interrupted

패널, 시각화, 점수, 도움말 모두 사용자의 글쓰기 흐름을 방해하지 않아야 한다.

#### 4. Different attribution criteria must remain distinguishable

수정 거리와 시맨틱 유사도는 같은 것이 아니다. 제품은 둘을 시각적으로나 개념적으로 섞지 않아야 한다.

#### 5. AI contribution should remain inspectable over time

AI가 생성한 텍스트는 삽입된 순간의 baseline을 유지해야 하며, 사용자가 시간이 지나며 어떻게 바꾸는지 추적 가능해야 한다.

### Primary Use Cases

#### Use Case 1: Generate and Revise

사용자가 우측 패널에서 프롬프트를 입력해 LLM 텍스트를 생성하고, 그 결과를 문서에 적용한 뒤, 메인 에디터에서 수정하면서 attribution cue를 본다.

#### Use Case 2: Compare Cue Criteria

사용자가 동일한 문서 상태에 대해 좌측 패널에서 edit-distance cue와 semantic cue를 전환해 보면서, 서로 다른 기준이 어떻게 다른 정보를 주는지 비교한다.

#### Use Case 3: Start Writing Manually, Then Ask for Help

사용자가 먼저 직접 글을 쓰다가 특정 문장 또는 구간을 선택해 우측 패널을 통해 LLM에게 이어쓰기 또는 재작성 도움을 요청하고, 그 결과를 문서에 삽입한 뒤 계속 수정한다.

#### Use Case 4: Inspect AI Residue in a Revised Passage

사용자가 이미 여러 차례 수정한 구간을 되돌아보며, 현재 남아 있는 문장이 여전히 AI 원문에 얼마나 기대고 있는지 시각적으로 확인한다.

### User Experience Overview

제품은 다음과 같은 고수준 흐름을 지원해야 한다.

1. 사용자가 문서를 시작한다.
2. 사용자는 직접 글을 쓰거나, LLM에게 생성 요청을 할 수 있다.
3. 생성 결과는 바로 문서에 반영되지 않고, 확인 후 삽입/대체/추가할 수 있어야 한다.
4. 문서에 삽입된 AI 텍스트는 provenance baseline으로 등록된다.
5. 사용자가 그 텍스트를 수정하면 attribution cue가 갱신된다.
6. 사용자는 좌측 패널에서 cue 기준을 바꾸며 현재 문서를 다시 볼 수 있다.
7. 사용자는 문서를 계속 수정하거나 저장할 수 있다.

### Information Architecture

제품은 세 개의 주요 UI 영역으로 구성된다.

#### 1. Center: Main Editor

메인 편집 영역. 제품의 중심.

포함 요소:

* 문서 제목 입력 영역
* 본문 편집기
* AI 텍스트가 삽입된 영역의 provenance 시각화
* 커서, 선택, 수정, 키보드 입력 지원
* 글자 수 또는 기본 지표 표시

#### 2. Left Panel: Attribution Settings Panel

attribution cue 관련 설정과 설명을 담는 공간.

포함 요소:

* Cue criteria selector
* Cue display mode selector
* Visualization intensity or style selector
* Granularity options
* Cue 설명 및 legend
* Optional advanced controls

#### 3. Right Panel: LLM Request Panel

LLM에게 텍스트 생성을 요청하고 결과를 관리하는 공간.

포함 요소:

* Prompt input
* Request button
* Generation options
* Result preview area
* Apply / Insert / Replace actions
* Current request loading state

### Panel Behavior Requirements

* 좌우 패널은 각각 독립적으로 열고 닫을 수 있어야 한다.
* 좌우 패널을 모두 닫은 상태에서도 에디터는 완전히 사용 가능해야 한다.
* 패널 상태는 시각적으로 명확해야 한다.
* 패널을 열거나 닫아도 현재 문서 상태는 유지되어야 한다.
* 패널은 데스크톱 기준 사이드 패널로 동작하되, 작은 화면에서는 접히거나 overlay 형태로 전환될 수 있어야 한다.

### Core Functional Requirements

#### A. Document Editing

* 사용자는 제목과 본문을 입력하고 수정할 수 있어야 한다.
* 사용자는 텍스트를 자유롭게 추가, 삭제, 치환할 수 있어야 한다.
* 사용자는 문서 안의 특정 구간을 선택할 수 있어야 한다.
* 에디터는 AI가 삽입한 텍스트와 사용자가 직접 작성한 텍스트를 provenance 차원에서 구분 관리할 수 있어야 한다.

#### B. LLM Requesting

* 사용자는 우측 패널에서 LLM에게 텍스트 생성을 요청할 수 있어야 한다.
* 사용자는 프롬프트를 직접 입력할 수 있어야 한다.
* 시스템은 generation loading state를 명확히 보여줘야 한다.
* 생성 결과는 적용 전 미리보기 가능해야 한다.
* 사용자는 생성 결과를 문서에 삽입, 대체, 추가 중 하나의 방식으로 반영할 수 있어야 한다.
* 적용된 AI 텍스트는 provenance baseline으로 등록되어야 한다.

#### C. AI Baseline Management

* 시스템은 AI가 삽입된 각 텍스트 chunk의 baseline text를 보존해야 한다.
* baseline은 사용자의 subsequent edits에 의해 자동으로 바뀌면 안 된다.
* 여러 번의 AI 생성이 문서 내에 존재할 수 있으므로, 시스템은 복수의 AI provenance span을 관리할 수 있어야 한다.

#### D. Attribution Cue System

시스템은 최소 두 개의 attribution cue를 지원해야 한다.

* Edit-Distance Cue
* Semantic Cue

시스템은 다음 cue mode를 지원해야 한다.

* Edit only
* Semantic only
* Both
* None

Cue는 다음 요구사항을 만족해야 한다.

* continuous signal이어야 한다.
* binary indicator가 아니어야 한다.
* 사용자에게 중립적 해석을 제공해야 한다.
* 문서 내 AI provenance span과 연결되어야 한다.

#### E. Edit-Distance Cue

* baseline AI span과 current span 사이의 표면적 편집량을 계산해야 한다.
* 값은 연속적으로 표현되어야 한다.
* 기본 해석은 “얼마나 많이 수정했는가”이다.
* 기본 시각화는 edit ratio가 커질수록 AI 하이라이트가 fade되는 방식이다.

##### E1. Edit-Distance Cue Baseline

* 사용자가 AI 생성 결과를 문서에 삽입하거나 적용하는 순간, 시스템은 해당 텍스트를 **AI baseline span**으로 등록해야 한다.
* baseline span은 provenance-tracked span이어야 하며, 최소한 다음 metadata를 가져야 한다.

  * baselineText
  * requestId or insertionId
  * cue-renderable visual attributes
* baselineText는 immutable baseline으로 유지되어야 한다.
* 사용자의 subsequent edits는 baselineText를 덮어써서는 안 된다.

##### E2. Edit-Distance Cue Comparison Unit

* Edit-distance cue의 기본 비교 단위는 **inserted AI span level**이다.
* 시스템은 문서 전체 diff가 아니라, 각 provenance-tracked AI span에 대해 독립적으로 cue를 계산해야 한다.
* 현재 span은 baseline span에 대응되는 현재 문서 내 텍스트 범위로 본다.
* 사용자가 해당 span을 수정, 축약, 확장, 치환하더라도 cue 계산은 여전히 해당 provenance span에 대해서만 수행되어야 한다.

##### E3. Edit-Distance Cue Normalization

* 시스템은 baseline span과 current span을 **문자 단위 또는 음절 단위의 선형 시퀀스**로 분해해야 한다.
* baseline과 current 사이의 표면적 차이는 **Levenshtein edit distance**로 계산해야 한다.
* insertion, deletion, substitution의 비용은 모두 1로 둔다.
* raw edit distance는 baseline length로 나누어 정규화해야 한다.
* 정규화된 값은 0과 1 사이로 clamp해야 한다.

공식은 다음과 같이 정의한다.

* let D = LevenshteinDistance(baselineUnits, currentUnits)
* let L = length(baselineUnits)
* if L = 0, score = 0
* else editRatio = min(D / L, 1.0)

##### E4. Edit-Distance Cue Interpretation

* editRatio = 0이면 현재 span이 baseline과 거의 동일한 상태이다.
* editRatio가 커질수록 표면적 수정량이 많다는 뜻이다.
* editRatio = 1에 가까울수록 baseline 대비 크게 다시 쓴 상태로 본다.
* 이 cue는 의미적 변화 여부를 직접 나타내지 않는다.

##### E5. Edit-Distance Cue Rendering Rule

* 기본 렌더링 규칙은 **retained provenance fade model**이다.
* cue opacity는 `1 - editRatio`를 기본값으로 사용한다.
* 따라서 거의 수정되지 않은 span은 하이라이트가 진하게 유지되고, 많이 수정될수록 점차 흐려져야 한다.
* 사용자가 하이라이트 색을 바꿀 수는 있지만, fade-by-editing 로직은 유지되어야 한다.

##### E6. Edit-Distance Cue Update Timing

* 사용자가 provenance-tracked AI span을 수정할 때 cue를 다시 계산해야 한다.
* 재계산은 타이핑마다 즉시 수행할 수도 있으나, 기본 구현은 **짧은 debounce 이후** 수행하는 것을 권장한다.
* 문서 저장 직전에는 미반영된 편집량이 없도록 cue 상태를 한 번 더 강제 갱신해야 한다.

#### F. Semantic Cue

* baseline AI span과 current span 사이의 의미적 유사도를 계산해야 한다.
* semantic cue는 edit-distance cue와 다른 계산 엔진을 사용해야 한다.
* 기본 해석은 “현재 텍스트가 여전히 AI 원문의 의미 구조와 얼마나 가까운가”이다.
* 기본 시각화는 semantic similarity가 높을수록 semantic residue가 더 강하게 남아 있는 방식으로 한다.
* semantic cue는 word overlap이나 단순 diff로 환원되면 안 된다.

##### F1. Semantic Cue Baseline

* semantic cue는 edit-distance cue와 동일한 provenance baseline span을 공유해야 한다.
* 즉 semantic cue도 AI 삽입 시점에 생성된 baselineText를 기준 텍스트로 사용해야 한다.
* semantic cue는 별도의 baseline을 새로 만들면 안 된다.

##### F2. Semantic Cue Comparison Unit

* semantic cue의 기본 비교 단위도 **inserted AI span level**이다.
* 시스템은 baseline span과 현재 대응 span 사이의 의미적 관계를 계산해야 한다.
* current span은 baseline span이 문서 안에서 수정된 현재 상태를 뜻한다.
* current span이 일부 확장되거나 축약되더라도, provenance span lifecycle은 유지되어야 한다.

##### F3. Semantic Cue Text Preparation

* semantic cue 계산 전, baselineText와 currentText는 동일한 전처리 규칙을 거쳐야 한다.
* 최소 전처리 단계는 다음을 포함해야 한다.

  * leading and trailing whitespace trim
  * repeated whitespace normalization
  * null or empty text handling
* punctuation removal은 기본값이 아니며, 원문 의미 보존을 위해 유지하는 것을 기본으로 한다.

##### F4. Semantic Cue Scoring Engine

* semantic cue는 **sentence embedding 기반 의미 유사도 계산**을 기본 구현으로 사용해야 한다.
* baselineText와 currentText는 각각 임베딩 벡터로 변환되어야 한다.
* 두 벡터 사이의 cosine similarity를 raw semantic similarity로 사용해야 한다.
* 기본 reference implementation은 일반 목적 sentence embedding model을 사용한다.
* 권장 기본값은 소형 일반 목적 sentence embedding model이며, 향후 대체 가능해야 한다.

##### F5. Semantic Cue Thresholding and Rescaling

* semantic cue는 약한 의미적 연관을 그대로 표시하지 않고, **weak-association threshold**를 적용해야 한다.
* raw cosine similarity가 threshold t 이하이면 semantic cue score는 0으로 처리한다.
* raw cosine similarity가 t를 초과하면, 값을 [t, 1] 구간에서 [0, 1] 구간으로 선형 재조정해야 한다.
* 기본 threshold 값은 `t = 0.35`로 둔다.

공식은 다음과 같이 정의한다.

* let s = cosineSimilarity(embedding(baselineText), embedding(currentText))
* if s <= t, semanticScore = 0
* else semanticScore = (s - t) / (1 - t)
* where t = 0.35 by default

##### F6. Semantic Cue Interpretation

* semanticScore = 0은 현재 span이 baseline과 의미적으로 충분히 멀어졌거나, weak-association threshold 아래라는 뜻이다.
* semanticScore가 높을수록 현재 span이 AI 원문의 의미 구조를 더 많이 유지하고 있다는 뜻이다.
* 이 score는 surface edit amount와 다를 수 있다.
* 따라서 사용자가 많이 고쳤더라도 semanticScore가 높을 수 있고, 적게 고쳤더라도 semanticScore가 낮아질 수 있다.

##### F7. Semantic Cue Rendering Rule

* 기본 렌더링 규칙은 **retained meaning residue model**이다.
* semanticScore가 높을수록 AI semantic residue가 더 강하게 남아 있는 것으로 시각화한다.
* semanticScore가 낮을수록 하이라이트는 더 옅어져야 한다.
* 구현은 opacity, underline intensity, background wash 등의 시각 채널 중 하나를 사용할 수 있으나, 기본 의미 방향은 유지해야 한다.
* 약한 유사도 구간은 완전한 absence보다 **lighter and more uncertain signal**로 표현할 수 있다.

##### F8. Semantic Cue Update Timing

* semantic cue는 provenance-tracked AI span이 수정될 때 다시 계산되어야 한다.
* semantic cue 계산은 edit-distance cue보다 무거울 수 있으므로, 기본 구현은 **debounced recomputation**을 사용해야 한다.
* 시스템은 사용자가 일정 시간 입력을 멈춘 뒤 semantic score를 갱신하는 방식을 기본값으로 삼아야 한다.
* 저장 직전에는 현재 span과 baseline 사이의 semantic score를 최종 갱신해야 한다.

##### F9. Semantic Cue Failure Handling

* semantic scoring engine이 응답하지 않거나 계산에 실패한 경우, 문서 편집은 중단되면 안 된다.
* 실패한 semantic cue는 unavailable state로 표시할 수 있어야 한다.
* 이 경우 edit-distance cue는 독립적으로 계속 동작해야 한다.

#### G. Cue Interpretation Layer

좌측 패널에는 최소 다음 설명이 있어야 한다.

* edit cue는 surface revision을 본다.
* semantic cue는 meaning retention을 본다.
* 두 값은 다르게 나올 수 있다.
* semantic similarity가 높다고 해서 자동으로 부정적 의미를 갖는 것은 아니다.

#### H. Save Action

* 사용자는 현재 문서를 저장할 수 있어야 한다.
* 저장은 현재 문서 상태와 제목을 기준으로 한다.
* 저장 직전, 시스템은 미반영된 편집 상태를 정리할 수 있어야 한다.
* 저장 기능은 MVP에서 로컬 또는 임시 세션 수준으로도 충분하다.

### State Requirements

시스템은 최소 다음 상태를 유지해야 한다.

* current document title
* current document content
* AI baseline spans and metadata
* current left panel open/closed state
* current right panel open/closed state
* current cue mode
* current visualization settings
* current generation request state
* current generation result preview
* current loading states

### Provenance Metadata Requirements

각 AI 삽입 span은 최소 다음 metadata를 가져야 한다.

* baseline text
* insertion id or request id
* cue-compatible attributes
* current visual style state
* insertion source metadata if needed

### Content Application Rules

생성된 AI 결과를 문서에 반영할 때 시스템은 다음 중 하나를 지원해야 한다.

* Insert at current cursor
* Replace selected text
* Append to current document

적용 후에는 다음이 발생해야 한다.

* baseline metadata 생성
* provenance span 등록
* cue 계산 가능 상태 진입

### Visual Design Requirements

* 메인 에디터는 제품의 가장 큰 시각적 비중을 가져야 한다.
* 좌우 패널은 보조적이지만 충분히 읽기 쉬워야 한다.
* cue 시각화는 텍스트 가독성을 해치지 않아야 한다.
* 색상만으로 정보를 전달하지 않도록 보조 설명이 있어야 한다.
* 사용자는 AI 하이라이트 색상을 선택 또는 변경할 수 있어야 한다.

### Accessibility Requirements

* 패널 열기/닫기는 키보드 접근 가능해야 한다.
* 버튼, 입력창, 토글은 명확한 레이블을 가져야 한다.
* cue 시각화는 색상 외에도 설명, 범례, 추가 시그널을 통해 이해 가능해야 한다.

### Performance Requirements

* 사용자가 타이핑할 때 에디터는 끊김 없이 반응해야 한다.
* cue는 실시간 또는 준실시간으로 갱신되어야 하되, 글쓰기 경험을 해치지 않아야 한다.
* LLM 요청 중에도 전체 UI는 안정적으로 유지되어야 한다.
* semantic cue 계산이 무거운 경우에도 입력 경험은 유지되어야 한다.

### Non-Functional Requirements

* 제품은 웹 브라우저에서 별도 설치 없이 접근 가능해야 한다.
* 공개 URL을 통해 다른 사용자가 접속 가능해야 한다.
* 구조는 이후 추가 cue 기준, 추가 generation mode, 저장 기능 확장에 대응할 수 있어야 한다.

### Success Criteria

#### Qualitative Success

* 사용자가 이 에디터를 단순 AI generator가 아니라 “수정과 성찰을 지원하는 글쓰기 도구”로 이해한다.
* 사용자가 edit cue와 semantic cue의 차이를 설명할 수 있다.
* 사용자가 자신의 수정 방식에 대해 더 구체적으로 말할 수 있다.
* 사용자가 cue를 intrusive한 감시 장치가 아니라 reflective signal로 받아들인다.

#### Quantitative Success

* generation 결과가 실제로 문서에 적용된다.
* 적용 후 사용자가 실제로 텍스트를 수정한다.
* 사용자가 cue mode를 전환해본다.
* both mode 또는 두 cue 비교 기능이 실제로 사용된다.
* 문서 작성 세션 중 패널 사용과 에디터 사용이 함께 발생한다.

### Implementation Guidance for Attribution Cues

이 섹션은 제품 요구사항을 구현으로 옮길 때, 에이전트가 attribution cue 두 기능을 처음부터 새로 설계하지 않고 **Augmentiary V4에서 이미 검증된 구조를 재사용**하도록 돕기 위한 가이드라인이다.

이 가이드라인의 목적은 다음과 같다.

* 제품 전체 PRD 안에서 cue 기능의 구현 기준점을 명확히 한다.
* provenance lifecycle을 새로 발명하지 않도록 한다.
* edit-distance cue는 V4 구현 경험을 직접 계승한다.
* semantic cue는 같은 provenance 구조를 공유하되, 계산 엔진만 별도로 설계하도록 한다.

#### Guidance Principle 1: 두 cue는 같은 baseline lifecycle을 공유해야 한다

에이전트는 edit-distance cue와 semantic cue를 완전히 별개의 기능으로 구현해서는 안 된다. 두 cue는 서로 다른 score를 계산하더라도, **같은 AI baseline span lifecycle** 위에서 작동해야 한다.

즉, 제품 안에서 AI 텍스트가 삽입될 때 다음 공통 단계가 먼저 존재해야 한다.

* AI text is inserted into the editor
* The inserted text becomes a provenance-tracked span
* The original inserted text is stored as baseline text
* The span receives cue-compatible metadata
* The current edited span continues to reference that fixed baseline

이 lifecycle은 두 cue 모두에 공통이다.

#### Guidance Principle 2: Edit-distance cue는 V4 구조를 기준 구현으로 삼아야 한다

에이전트는 edit-distance cue를 새로 추상적으로 설계하지 말고, **Augmentiary V4의 실제 작동 방식**을 기준 구현으로 삼아야 한다.

V4에서의 핵심 구조는 다음과 같다.

* AI가 삽입된 텍스트는 일반 텍스트가 아니라 provenance mark가 붙은 span으로 관리된다.
* 삽입 시점의 AI 원문은 span metadata 안에 baseline text로 저장된다.
* 사용자가 그 span을 수정할 때마다 현재 span text와 baseline text를 비교한다.
* edit ratio를 계산한다.
* edit ratio가 커질수록 highlight opacity를 줄인다.
* 결과적으로 사용자가 많이 수정할수록 AI highlight가 점차 사라진다.

이 제품의 edit-distance cue는 이 구조를 그대로 계승해야 한다.

#### Edit-Distance Cue Implementation Guideline

에이전트는 아래를 구현 기본 규칙으로 삼아야 한다.

* AI text insertion must create a tracked provenance span.
* Each tracked span must store its original AI text as immutable baseline text.
* The system must recalculate surface edit ratio whenever the tracked span is edited.
* The cue must operate at the inserted-span level, not only at whole-document level.
* The default visual rule must be fade-by-editing: more editing leads to weaker highlight.
* Color customization may change hue, but not the underlying fade logic.

중요한 점은, 이 cue는 문서 전체 diff가 아니라 **AI가 실제로 삽입된 span을 기준으로 작동**해야 한다는 것이다.

#### Guidance Principle 3: Semantic cue는 V4의 provenance 구조를 재사용하되, 계산 엔진은 분리해야 한다

semantic cue는 V4의 edit ratio 함수를 변형해서 만들어서는 안 된다. 대신, **V4가 이미 갖고 있는 provenance baseline model을 재사용하고, 그 위에 별도 semantic scoring engine을 얹는 구조**로 구현해야 한다.

즉 semantic cue는 다음을 공유한다.

* same inserted AI span
* same immutable baseline text
* same current edited span
* same visual integration surface in the editor

그러나 다음은 별도로 가져가야 한다.

* different score definition
* different calculation engine
* different interpretation layer

#### Semantic Cue Implementation Guideline

에이전트는 semantic cue를 다음처럼 이해하고 구현해야 한다.

* Semantic cue compares meaning, not surface form.
* It must use the same provenance-tracked baseline span created during AI insertion.
* It must not reuse edit-ratio logic, string diff, or token overlap as its primary score.
* It must compute a separate semantic similarity score between baseline text and current span text.
* The default scoring direction should be retained-meaning oriented: higher score means current text remains semantically closer to the AI original.
* The default visual behavior should align with edit cue semantics for consistency: stronger retained meaning can preserve stronger semantic residue highlight, while lower similarity should fade it.

#### Recommended Semantic Scoring Strategy

이 제품에서 semantic cue는 우선 다음 우선순위로 구현하도록 명시한다.

1. **Preferred**: embedding-based similarity

* baseline span과 current span을 임베딩으로 변환한다.
* cosine similarity 또는 동등한 metric을 사용한다.
* score를 0~1 범위로 정규화한다.

2. **Optional future extension**: LLM-assisted semantic judgment

* baseline span과 current span을 LLM이 비교해 semantic similarity를 보정하거나 판정하도록 할 수 있다.
* 그러나 latency, cost, reproducibility 문제 때문에 기본 구현 방식으로는 삼지 않는다.

#### Guidance Principle 4: Both mode는 두 cue를 합쳐 하나의 값으로 만들지 않아야 한다

에이전트는 both mode를 “하나의 통합 provenance score”로 구현해서는 안 된다. 제품의 핵심은 사용자가 **surface revision**과 **meaning retention**을 구분해 볼 수 있게 하는 데 있기 때문이다.

따라서 both mode는 아래 원칙을 따라야 한다.

* edit-distance score and semantic similarity score remain separate
* they may share the same span and baseline
* they may share a visual surface
* but they must remain conceptually distinguishable

#### Guidance Principle 5: Cue 설명 문구도 구현의 일부다

에이전트는 cue가 단순 시각 효과가 아니라 해석 가능한 인터페이스라는 점을 고려해야 한다. 좌측 패널에는 최소 다음 설명이 포함되어야 한다.

* Edit cue shows how much the AI text has been surface-edited.
* Semantic cue shows how semantically close the current text remains to the original AI text.
* These two cues can diverge.
* Higher semantic similarity does not automatically mean misuse or overreliance.

#### Agent Instruction Summary

에이전트는 이 PRD를 다음처럼 해석해야 한다.

* 전체 제품은 LLM-assisted writing editor이다.
* attribution cue는 그 안의 핵심 기능이다.
* edit-distance cue는 Augmentiary V4의 구현 경험을 직접 재사용해야 한다.
* semantic cue는 같은 provenance lifecycle을 공유하지만, 별도의 semantic scoring engine으로 구현해야 한다.
* 새로운 provenance architecture를 처음부터 다시 설계하는 것은 우선순위가 아니다.
* 우선순위는 기존 Augmentiary 경험을 활용해 baseline span tracking을 안정적으로 재사용하는 것이다.

### Technical Context

이 제품은 다음 조합을 전제로 한다.

* Frontend: React + TypeScript + Vite
* Hosting: GitHub Pages
* API / Server-side logic: Cloudflare Worker

이 기술 맥락은 제품 요구사항을 충족하기 위한 전제이며, 본 문서의 핵심은 제품 기능과 상태 정의이다.

### Open Questions

* semantic cue의 기본 계산 단위를 inserted span으로만 둘지, sentence-level fallback을 둘지
* both mode에서 두 cue를 동일 시각 채널로 표현할지, 일부는 숫자/tooltip로 분리할지
* 여러 AI generation chunk가 중첩되거나 인접할 때 provenance 경계를 어떻게 관리할지
* 저장 기능을 세션 수준으로 둘지, 문서 수준 persist로 확장할지
* semantic cue 계산 비용과 속도를 어떤 수준에서 타협할지

### Agent Note

이 제품의 핵심은 attribution cue 두 개만 있는 실험 UI가 아니라, **LLM-assisted writing workflow 전체를 지원하는 에디터**라는 점이다. attribution cue는 이 전체 제품 안에서 사용자의 수정 과정을 해석하도록 돕는 핵심 기능이지만, 제품 전체의 목적은 생성, 삽입, 수정, 비교, 저장, 성찰이 한 화면 안에서 이루어지는 것이다.
