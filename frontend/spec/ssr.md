# SSR 구현 검토 - 잠재적 개선 사항 및 추가 조사

이 문서는 `zxc-blog` 프런트엔드의 서버 측 렌더링(SSR) 구현과 관련하여 잠재적인 개선 사항 및 추가 조사 영역을 설명합니다.

## 1. 데이터 하이드레이션 (`__INITIAL_DATA__`)

**이전 문제:** `entry-server.tsx`는 `routerContext`(로더가 가져온 데이터를 포함)를 올바르게 반환하지만, 제공된 파일에는 이 `routerContext`를 클라이언트에 제공되는 최종 HTML의 `window.__INITIAL_DATA__`로 직렬화하는 명시적인 코드가 없었습니다. 이는 클라이언트 측 하이드레이션에 중요한 단계입니다.

**현재 상태 (backend/src/app.ts에서 확인):**
`backend/src/app.ts` 파일에서 `routerContext`를 직렬화하여 HTML에 주입하는 코드가 확인되었습니다.
- `const initialData = escapeHtml(JSON.stringify(routerContext));` 코드가 데이터를 올바르게 직렬화합니다.
- `html = html.replace(`<script>window.__INITIAL_DATA__ = undefined;</script>`, `<script>window.__INITIAL_DATA__ = ${initialData};</script>`);` 코드가 HTML 템플릿에 올바르게 주입합니다.
- `escapeHtml` 함수를 사용하여 JSON을 HTML에 직접 삽입할 때 발생할 수 있는 XSS 취약점을 방지하고 있습니다.

**결론:** 데이터 하이드레이션은 `backend/src/app.ts`에서 올바르게 처리되고 있습니다.

## 2. 오류 처리

**이전 문제:** `entry-server.tsx`의 `render` 함수는 서버에서 발생할 수 있는 데이터 가져오기 또는 렌더링 문제에 대한 강력한 오류 처리를 명시적으로 보여주지 않았습니다.

**현재 상태 (backend/src/app.ts에서 확인):**
`backend/src/app.ts`에는 SSR 로직 주변에 `try...catch` 블록이 있어 기본적인 오류 처리가 되어 있습니다.
- `console.error(e);`를 통해 오류를 기록합니다.
- `res.status(500).end(e.message);`를 통해 클라이언트에 500 상태 코드와 오류 메시지를 보냅니다.
- 개발 환경에서는 `vite?.ssrFixStacktrace(e);`를 사용하여 디버깅에 유용합니다.

**개선 권고:** 기본적인 오류 처리는 존재하지만, 더 강력하게 개선할 수 있습니다. 예를 들어, 오류 메시지만 표시하는 대신 사용자 지정 오류 페이지를 렌더링하거나, 프로덕션 환경과 개발 환경에 따라 다른 오류 처리 전략을 구현하는 것을 고려할 수 있습니다.

## 3. 스트리밍 SSR (선택 사항이지만 성능 향상을 위해 권장)

**이전 문제:** 현재 `ReactDOMServer.renderToString`이 사용되어 전체 React 애플리케이션을 문자열로 렌더링한 다음 클라이언트에 보냅니다. 대규모 애플리케이션이나 느린 네트워크 환경에서는 TTFB(Time To First Byte) 및 체감 로딩 속도를 지연시킬 수 있습니다.

**현재 상태 (backend/src/app.ts에서 확인):**
`entry-server.tsx`의 `render` 함수를 통해 `ReactDOMServer.renderToString`이 간접적으로 사용되고 있으며, 스트리밍 SSR은 구현되지 않았습니다.

**개선 권고:** `ReactDOMServer.renderToString`에서 `ReactDOMServer.renderToPipeableStream`(Node.js 스트림용) 또는 `ReactDOMServer.renderToReadableStream`(웹 스트림용)과 같은 스트리밍 SSR API로 마이그레이션하는 것을 고려할 수 있습니다. 이를 통해 서버가 HTML을 클라이언트에 청크 단위로 보낼 수 있어 브라우저가 페이지를 더 빨리 렌더링하기 시작하여 체감 성능을 향상시킬 수 있습니다. 이 변경은 서버가 출력을 소비하고 보내는 방식에 대한 수정이 필요합니다.

## 4. CSS/자산 처리

**이전 문제:** Vite는 CSS 및 자산을 효율적으로 처리하지만, FOUC(Flash of Unstyled Content)를 방지하기 위해 SSR에 최적으로 중요한 CSS가 처리되는지 확인하는 것이 중요합니다.

**현재 상태 (backend/src/app.ts에서 확인):**
- 개발 환경에서는 `vite.transformIndexHtml`이 사용되어 자산 변환을 처리합니다.
- 프로덕션 환경에서는 `express.static`이 클라이언트 측 빌드를 제공하며, Vite의 빌드 프로세스가 CSS 추출 및 연결을 처리합니다. 이는 올바르게 설정된 것으로 보입니다.

**결론:** CSS/자산 처리는 Vite를 통해 올바르게 설정되어 있습니다.

## 5. 서버 측 데이터 가져오기 보안

**이전 문제:** `loader` 함수(또는 기타 서버 측 데이터 가져오기 로직)가 백엔드에 API 호출을 하는 경우, 주의 깊게 처리하지 않으면 민감한 정보(예: API 키, 인증 토큰)가 클라이언트에 노출될 위험이 있습니다.

**현재 상태 (backend/src/app.ts에서 확인):**
`escapeHtml` 함수를 사용하여 `routerContext`를 HTML에 주입할 때 XSS를 방지하고 있습니다. 이는 좋은 보안 조치입니다.

**개선 권고:**
- 서버 측 데이터 가져오기 중에 사용되는 민감한 데이터나 자격 증명은 서버 환경에 엄격하게 제한되어야 하며, 클라이언트 측 번들이나 `window.__INITIAL_DATA__`에 직렬화되거나 노출되지 않도록 해야 합니다.
- 서버 측 API 호출에 대한 적절한 인증 및 권한 부여 검사를 구현해야 합니다.
- XSS 취약점을 방지하기 위해 서버에서 가져온 모든 데이터를 클라이언트에 전달하기 전에 소독(sanitize)해야 합니다.