<script setup lang="ts">
import { computed, ref } from 'vue';
import { useData } from 'vitepress';
import dashboardImage from '../../../assets/landing/tui-dashboard.webp';
import rulesImage from '../../../assets/landing/tui-rules.webp';
import precheckImage from '../../../assets/landing/tui-precheck.webp';

type Point = {
  title: string;
  body: string;
};

type Fact = {
  value: string;
  label: string;
};

type LandingCopy = {
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  installCta: string;
  docsCta: string;
  releaseCta: string;
  facts: Fact[];
  flowEyebrow: string;
  flowTitle: string;
  flowBody: string;
  flowSteps: string[];
  tuiEyebrow: string;
  tuiTitle: string;
  tuiBody: string;
  mediaTabs: string[];
  mediaAlt: string[];
  mcpEyebrow: string;
  mcpTitle: string;
  mcpBody: string;
  mcpPoints: Point[];
  securityEyebrow: string;
  securityTitle: string;
  securityBody: string;
  securityPoints: Point[];
  platformEyebrow: string;
  platformTitle: string;
  platformBody: string;
  finalTitle: string;
  finalBody: string;
  copyLabel: string;
  copiedLabel: string;
  prereleaseNote: string;
};

const english: LandingCopy = {
  heroEyebrow: 'v0.3.0 · Stable release',
  heroTitle: 'Keep TCP/UDP forwarding under control.',
  heroBody:
    'A pure-Go L4 forwarding runtime for servers and control planes. Run TCP, UDP, and tcp+udp rules with shared bandwidth limits, durable traffic quotas, a real TUI, and local read-only MCP visibility.',
  installCta: 'Install v0.3.0',
  docsCta: 'Read the docs',
  releaseCta: 'View release',
  facts: [
    { value: 'TCP · UDP · tcp+udp', label: 'L4 forwarding modes' },
    { value: '5 tools', label: 'Read-only stdio MCP' },
    { value: 'Loopback only', label: 'Management transport' },
    { value: '3 operating systems', label: 'Linux · macOS · Windows' },
  ],
  flowEyebrow: 'Bounded by design',
  flowTitle: 'One explicit path from source to counters.',
  flowBody:
    'Admission happens before scarce resources are consumed. Shared rate limits and daily or monthly allowances stay visible while counters cover forwarded and rejected traffic.',
  flowSteps: ['Source IP policy', 'Listener', 'Connection, rate & quota', 'Target', 'Counters'],
  tuiEyebrow: 'Real terminal UI',
  tuiTitle: 'Operate the runtime where it runs.',
  tuiBody:
    'Create, edit, copy, enable, disable, precheck, and apply rules from the terminal. The Dashboard also shows live network interfaces and host RX/TX rates from the connected daemon.',
  mediaTabs: ['Dashboard', 'Rules', 'Precheck'],
  mediaAlt: [
    'vmflow TUI dashboard with running rules and traffic counters',
    'vmflow TUI rules view with TCP, UDP, and tcp+udp rules',
    'vmflow TUI precheck view showing a passed validation',
  ],
  mcpEyebrow: 'Read-only MCP',
  mcpTitle: 'Give your AI visibility, not control.',
  mcpBody:
    'vmflow mcp is a foreground stdio adapter for an already running local daemon. It exposes five focused tools and no write path.',
  mcpPoints: [
    { title: 'Inspect health', body: 'Connection state, version, authorization, rule counts, traffic, and degraded signals.' },
    { title: 'Trace a rule', body: 'List safe summaries, then inspect one rule and its live counters when detail is needed.' },
    { title: 'Validate safely', body: 'Run precheck against the persisted configuration without applying or rewriting it.' },
  ],
  securityEyebrow: 'Admission and limits',
  securityTitle: 'Reject earlier. Bound rate and allowance.',
  securityBody:
    'Per-rule source policies run before forwarding. Aggregate upload/download limits and durable daily or monthly quotas cap what accepted traffic can consume.',
  securityPoints: [
    { title: 'Allowlist or denylist', body: 'Match the socket peer with up to 256 literal addresses or CIDRs per rule.' },
    { title: 'Shared bandwidth', body: 'Every TCP connection and UDP session with the same rule_id shares its directional buckets.' },
    { title: 'Durable quotas', body: 'Upload plus download usage survives restarts and reopens at the next calendar boundary.' },
  ],
  platformEyebrow: 'Server native',
  platformTitle: 'One binary, native service lifecycle.',
  platformBody:
    'Install as a systemd service, launchd daemon, or Windows Service. Release archives include SHA-256 checksums for every supported build.',
  finalTitle: 'Install vmflow v0.3.0.',
  finalBody:
    'Pin v0.3.0 for a reproducible install, or omit --version to follow the latest stable release.',
  copyLabel: 'Copy command',
  copiedLabel: 'Copied',
  prereleaseNote: 'Review the configuration, quotas, and firewall before exposing a forwarding port.',
};

const chinese: LandingCopy = {
  heroEyebrow: 'v0.3.0 · 正式版',
  heroTitle: '让 TCP/UDP 转发保持可控。',
  heroBody:
    '面向服务器与控制面的纯 Go L4 转发运行时。用一个二进制运行 TCP、UDP 与 tcp+udp 规则，支持规则共享限速、持久化日/月流量配额、真实 TUI 与本地只读 MCP。',
  installCta: '安装 v0.3.0',
  docsCta: '阅读文档',
  releaseCta: '查看 Release',
  facts: [
    { value: 'TCP · UDP · tcp+udp', label: 'L4 转发模式' },
    { value: '5 个工具', label: '只读 stdio MCP' },
    { value: '仅本机回环', label: '管理通道' },
    { value: '3 个操作系统', label: 'Linux · macOS · Windows' },
  ],
  flowEyebrow: '资源边界清晰',
  flowTitle: '从来源到计数器，每一步都明确。',
  flowBody: '在占用稀缺资源之前完成准入检查。规则共享限速和日/月配额保持可见，计数器覆盖成功转发与被拒绝的流量。',
  flowSteps: ['Source IP 策略', '监听端口', '连接、限速与配额', '目标服务', '流量与拒绝计数'],
  tuiEyebrow: '真实终端界面',
  tuiTitle: '直接在运行环境中完成日常运维。',
  tuiBody:
    '在终端创建、编辑、复制、启停、预检并应用规则。概览还会显示守护进程主机的网卡、累计流量与实时收发速率。',
  mediaTabs: ['概览', '规则', '预检'],
  mediaAlt: ['显示运行规则和流量计数的 vmflow TUI 概览', '显示 TCP、UDP 和 tcp+udp 规则的 vmflow TUI', '显示预检通过的 vmflow TUI'],
  mcpEyebrow: '只读 MCP',
  mcpTitle: '让 AI 看见状态，而不是拿到控制权。',
  mcpBody: 'vmflow mcp 是已运行本地守护进程的前台 stdio 适配器，只暴露五个聚焦工具，不提供写入路径。',
  mcpPoints: [
    { title: '检查健康状态', body: '查看连接、版本、授权、规则数量、流量与降级信号。' },
    { title: '追踪单条规则', body: '先列出安全摘要，需要时再查看一条规则及其实时计数。' },
    { title: '安全执行预检', body: '校验已持久化的当前配置，不应用规则，也不改写文件。' },
  ],
  securityEyebrow: '准入与资源限制',
  securityTitle: '更早拒绝，并限制速率与用量。',
  securityBody:
    'Source IP 策略会在转发前执行；规则级上传/下载限速和持久化日/月配额继续约束已接受的业务流量。',
  securityPoints: [
    { title: 'Allowlist 或 denylist', body: '按 socket peer 匹配，每条规则最多 256 个 IP 或 CIDR。' },
    { title: '规则共享限速', body: '同一 rule_id 的所有 TCP 连接与 UDP 会话共享分方向令牌桶。' },
    { title: '持久化流量配额', body: '上传与下载合并计量，重启后继续生效，并在下一个日历周期自动开放。' },
  ],
  platformEyebrow: '服务器原生部署',
  platformTitle: '一个二进制，接入系统原生服务生命周期。',
  platformBody: '作为 systemd、launchd 或 Windows Service 运行。每个受支持的发布包都提供 SHA-256 校验。',
  finalTitle: '安装 vmflow v0.3.0 正式版。',
  finalBody: '固定 v0.3.0 可获得可复现安装；省略 --version 则自动跟随最新稳定版。',
  copyLabel: '复制命令',
  copiedLabel: '已复制',
  prereleaseNote: '对外开放任何转发端口前，请先检查配置、流量配额与防火墙。',
};

const japanese: Partial<LandingCopy> = {
  heroEyebrow: 'v0.3.0 · 安定版',
  heroTitle: 'トラフィック転送を確実に制御。',
  heroBody: 'TCP、UDP、tcp+udp に対応し、ルール共有帯域制限、永続的な日次・月次クォータ、TUI、ローカルの読み取り専用 MCP を備えた pure-Go L4 フォワーダーです。',
  installCta: 'v0.3.0 をインストール',
  docsCta: 'ドキュメントを見る',
  releaseCta: 'Release を見る',
  facts: [
    { value: 'TCP · UDP · tcp+udp', label: 'L4 転送モード' },
    { value: '5 ツール', label: '読み取り専用 stdio MCP' },
    { value: 'Loopback 限定', label: '管理トランスポート' },
    { value: '3 OS', label: 'Linux · macOS · Windows' },
  ],
  flowTitle: '1 つのルール、明確な経路。',
  flowBody: 'ローカルで待ち受け、転送先を指定し、接続元と消費できるリソースを制限します。',
  flowSteps: ['Source IP ポリシー', 'リスナー', '接続・セッション制限', '転送先', 'カウンター'],
  tuiEyebrow: '実際のターミナル UI',
  tuiTitle: '実行環境でそのまま運用。',
  tuiBody: 'ターミナルからルールの作成、編集、切り替え、事前検証、適用まで行えます。ダッシュボードにはホストの NIC と RX/TX レートも表示されます。',
  mediaTabs: ['ダッシュボード', 'ルール', '事前検証'],
  mcpEyebrow: '読み取り専用 MCP',
  mcpTitle: 'AI には可視性を、制御権は与えない。',
  mcpBody: 'stdio で動作し、loopback 限定のローカルデーモンを読み取ります。設定を書き換えるツールはありません。',
  mcpPoints: [
    { title: '5 つの専用ツール', body: '状態、ルール、トラフィック統計、設定の事前検証を確認できます。' },
    { title: 'ローカル設計', body: 'stdio と loopback により管理経路をホスト内に保ちます。' },
    { title: '読み取り専用境界', body: 'エージェントは確認と検証のみ行い、稼働中の設定は変更できません。' },
  ],
  securityTitle: '転送入口で拒否し、残りを制限。',
  securityBody: 'IPv4/IPv6/CIDR ポリシーを転送前に評価し、共有帯域制限と永続的な日次・月次クォータで許可済みトラフィックを制御します。',
  securityPoints: [
    { title: '許可または拒否', body: 'ルールごとに socket peer の IP または CIDR を照合します。' },
    { title: 'TCP はダイヤル前', body: '拒否された接続は max_conn を消費せず、転送先へ到達しません。' },
    { title: 'UDP はセッション前', body: '拒否されたデータグラムはセッションを割り当てません。' },
  ],
  platformTitle: '1 つのバイナリ、OS ネイティブのサービス。',
  platformBody: 'Linux の systemd、macOS の launchd、Windows Service として運用できます。',
  finalTitle: 'vmflow v0.3.0 安定版をインストール。',
  finalBody: '再現可能なインストールには v0.3.0 を固定し、最新安定版を追従する場合は --version を省略します。',
  copyLabel: 'コマンドをコピー',
  copiedLabel: 'コピー済み',
  prereleaseNote: '転送ポートを公開する前に設定、トラフィッククォータ、ファイアウォールを確認してください。',
};

const russian: Partial<LandingCopy> = {
  heroEyebrow: 'v0.3.0 · стабильный выпуск',
  heroTitle: 'Перенаправляйте трафик под контролем.',
  heroBody: 'L4-форвардер на чистом Go для TCP, UDP и tcp+udp с общими лимитами скорости правила, постоянными суточными и месячными квотами, TUI и локальным MCP только для чтения.',
  installCta: 'Установить v0.3.0',
  docsCta: 'Открыть документацию',
  releaseCta: 'Открыть Release',
  facts: [
    { value: 'TCP · UDP · tcp+udp', label: 'Режимы L4' },
    { value: '5 инструментов', label: 'MCP stdio только для чтения' },
    { value: 'Только loopback', label: 'Канал управления' },
    { value: '3 ОС', label: 'Linux · macOS · Windows' },
  ],
  flowTitle: 'Одно правило. Понятный маршрут.',
  flowBody: 'Сначала проверяется источник, затем применяются лимиты и только после этого трафик достигает цели.',
  flowSteps: ['Политика Source IP', 'Слушатель', 'Лимиты соединений', 'Целевой сервис', 'Счётчики'],
  tuiEyebrow: 'Настоящий терминальный интерфейс',
  tuiTitle: 'Управляйте там, где работает сервис.',
  tuiBody: 'Создавайте, редактируйте, проверяйте и применяйте правила из терминала. Обзор также показывает интерфейсы хоста и скорости RX/TX.',
  mediaTabs: ['Обзор', 'Правила', 'Проверка'],
  mcpEyebrow: 'MCP только для чтения',
  mcpTitle: 'Дайте ИИ видимость, но не управление.',
  mcpBody: 'Адаптер работает через stdio и читает локальный демон через loopback. Инструментов записи нет.',
  mcpPoints: [
    { title: 'Пять инструментов', body: 'Состояние демона, правила, статистика трафика и предварительная проверка.' },
    { title: 'Локальный по замыслу', body: 'stdio и loopback сохраняют путь управления внутри хоста.' },
    { title: 'Только чтение', body: 'Агент может проверять, но не изменять активную конфигурацию.' },
  ],
  securityTitle: 'Отклоняйте раньше. Ограничивайте остальное.',
  securityBody: 'Политики IPv4/IPv6/CIDR выполняются до пересылки, а общие лимиты скорости и постоянные суточные или месячные квоты ограничивают принятый трафик.',
  securityPoints: [
    { title: 'Разрешение или запрет', body: 'Сопоставляйте IP и CIDR socket peer отдельно для каждого правила.' },
    { title: 'TCP до подключения', body: 'Отклонённые источники не занимают max_conn и не достигают цели.' },
    { title: 'UDP до сессии', body: 'Отклонённые датаграммы не создают сессии.' },
  ],
  platformTitle: 'Один бинарник, нативный сервис ОС.',
  platformBody: 'Запускайте через systemd, launchd или Windows Service.',
  finalTitle: 'Установите стабильный vmflow v0.3.0.',
  finalBody: 'Зафиксируйте v0.3.0 для воспроизводимой установки или уберите --version для последней стабильной версии.',
  copyLabel: 'Копировать команду',
  copiedLabel: 'Скопировано',
  prereleaseNote: 'Проверьте конфигурацию, квоты трафика и межсетевой экран до открытия порта.',
};

const spanish: Partial<LandingCopy> = {
  heroEyebrow: 'v0.3.0 · versión estable',
  heroTitle: 'Reenvía tráfico con control.',
  heroBody: 'Runtime L4 en Go puro para TCP, UDP y tcp+udp, con límites compartidos por regla, cuotas diarias y mensuales persistentes, TUI y MCP local de solo lectura.',
  installCta: 'Instalar v0.3.0',
  docsCta: 'Ver documentación',
  releaseCta: 'Ver Release',
  facts: [
    { value: 'TCP · UDP · tcp+udp', label: 'Modos L4' },
    { value: '5 herramientas', label: 'MCP stdio de solo lectura' },
    { value: 'Solo loopback', label: 'Canal de gestión' },
    { value: '3 sistemas', label: 'Linux · macOS · Windows' },
  ],
  flowTitle: 'Una regla. Una ruta clara.',
  flowBody: 'La admisión se valida antes de consumir recursos; después se aplican límites y se alcanza el destino.',
  flowSteps: ['Política Source IP', 'Listener', 'Límites de conexión', 'Destino', 'Contadores'],
  tuiEyebrow: 'Interfaz de terminal real',
  tuiTitle: 'Opera el runtime donde se ejecuta.',
  tuiBody: 'Crea, edita, verifica y aplica reglas desde la terminal. El panel también muestra interfaces del host y tasas RX/TX.',
  mediaTabs: ['Panel', 'Reglas', 'Verificación'],
  mcpEyebrow: 'MCP de solo lectura',
  mcpTitle: 'Da visibilidad a la IA, no control.',
  mcpBody: 'El adaptador usa stdio y lee el daemon local mediante loopback. No expone herramientas de escritura.',
  mcpPoints: [
    { title: 'Cinco herramientas', body: 'Estado, reglas, estadísticas de tráfico y verificación de configuración.' },
    { title: 'Local por diseño', body: 'stdio y loopback mantienen la gestión dentro del host.' },
    { title: 'Solo lectura', body: 'El agente puede inspeccionar y validar, pero no modificar la configuración.' },
  ],
  securityTitle: 'Rechaza antes. Limita el resto.',
  securityBody: 'Las políticas IPv4/IPv6/CIDR se ejecutan antes del reenvío; los límites compartidos y las cuotas diarias o mensuales persistentes controlan el tráfico aceptado.',
  securityPoints: [
    { title: 'Permitir o denegar', body: 'Compara IP y CIDR del socket peer en cada regla.' },
    { title: 'TCP antes del dial', body: 'Los orígenes rechazados no consumen max_conn ni llegan al destino.' },
    { title: 'UDP antes de la sesión', body: 'Los datagramas rechazados no asignan sesiones.' },
  ],
  platformTitle: 'Un binario, servicio nativo del sistema.',
  platformBody: 'Ejecuta vmflow con systemd, launchd o Windows Service.',
  finalTitle: 'Instala vmflow v0.3.0 estable.',
  finalBody: 'Fija v0.3.0 para una instalación reproducible u omite --version para seguir la última versión estable.',
  copyLabel: 'Copiar comando',
  copiedLabel: 'Copiado',
  prereleaseNote: 'Revisa la configuración, las cuotas de tráfico y el firewall antes de abrir un puerto.',
};

const portuguese: Partial<LandingCopy> = {
  heroEyebrow: 'v0.3.0 · versão estável',
  heroTitle: 'Encaminhe tráfego com controle.',
  heroBody: 'Runtime L4 em Go puro para TCP, UDP e tcp+udp, com limites compartilhados por regra, cotas diárias e mensais persistentes, TUI e MCP local somente leitura.',
  installCta: 'Instalar v0.3.0',
  docsCta: 'Ver documentação',
  releaseCta: 'Ver Release',
  facts: [
    { value: 'TCP · UDP · tcp+udp', label: 'Modos L4' },
    { value: '5 ferramentas', label: 'MCP stdio somente leitura' },
    { value: 'Somente loopback', label: 'Canal de gerenciamento' },
    { value: '3 sistemas', label: 'Linux · macOS · Windows' },
  ],
  flowTitle: 'Uma regra. Um caminho claro.',
  flowBody: 'A admissão é validada antes de consumir recursos; depois vêm os limites, o destino e os contadores.',
  flowSteps: ['Política Source IP', 'Listener', 'Limites de conexão', 'Destino', 'Contadores'],
  tuiEyebrow: 'Interface de terminal real',
  tuiTitle: 'Opere o runtime onde ele está.',
  tuiBody: 'Crie, edite, verifique e aplique regras no terminal. O painel também mostra interfaces do host e taxas RX/TX.',
  mediaTabs: ['Painel', 'Regras', 'Pré-verificação'],
  mcpEyebrow: 'MCP somente leitura',
  mcpTitle: 'Dê visibilidade à IA, não controle.',
  mcpBody: 'O adaptador usa stdio e lê o daemon local via loopback. Não há ferramentas de escrita.',
  mcpPoints: [
    { title: 'Cinco ferramentas', body: 'Estado, regras, estatísticas de tráfego e pré-verificação da configuração.' },
    { title: 'Local por design', body: 'stdio e loopback mantêm o gerenciamento dentro do host.' },
    { title: 'Somente leitura', body: 'O agente pode inspecionar e validar, mas não alterar a configuração.' },
  ],
  securityTitle: 'Rejeite antes. Limite o restante.',
  securityBody: 'Políticas IPv4/IPv6/CIDR são avaliadas antes do encaminhamento; limites compartilhados e cotas diárias ou mensais persistentes controlam o tráfego aceito.',
  securityPoints: [
    { title: 'Permitir ou negar', body: 'Compare IP e CIDR do socket peer em cada regra.' },
    { title: 'TCP antes do dial', body: 'Origens negadas não consomem max_conn nem chegam ao destino.' },
    { title: 'UDP antes da sessão', body: 'Datagramas negados não alocam sessões.' },
  ],
  platformTitle: 'Um binário, serviço nativo do sistema.',
  platformBody: 'Execute com systemd, launchd ou Windows Service.',
  finalTitle: 'Instale o vmflow v0.3.0 estável.',
  finalBody: 'Fixe v0.3.0 para uma instalação reproduzível ou omita --version para seguir a versão estável mais recente.',
  copyLabel: 'Copiar comando',
  copiedLabel: 'Copiado',
  prereleaseNote: 'Revise a configuração, as cotas de tráfego e o firewall antes de abrir uma porta.',
};

const korean: Partial<LandingCopy> = {
  heroEyebrow: 'v0.3.0 · 안정 버전',
  heroTitle: '트래픽 전달을 명확하게 제어하세요.',
  heroBody: 'TCP, UDP, tcp+udp를 지원하고 규칙 공유 대역폭 제한, 영구 일간·월간 쿼터, TUI, 로컬 읽기 전용 MCP를 제공하는 pure-Go L4 런타임입니다.',
  installCta: 'v0.3.0 설치',
  docsCta: '문서 보기',
  releaseCta: 'Release 보기',
  facts: [
    { value: 'TCP · UDP · tcp+udp', label: 'L4 포워딩 모드' },
    { value: '도구 5개', label: '읽기 전용 stdio MCP' },
    { value: 'Loopback 전용', label: '관리 경로' },
    { value: '운영체제 3개', label: 'Linux · macOS · Windows' },
  ],
  flowTitle: '하나의 규칙, 명확한 경로.',
  flowBody: '리소스를 사용하기 전에 소스를 검사하고 제한을 적용한 뒤 대상과 카운터로 이어집니다.',
  flowSteps: ['Source IP 정책', '리스너', '연결 및 세션 제한', '대상 서비스', '카운터'],
  tuiEyebrow: '실제 터미널 UI',
  tuiTitle: '실행되는 곳에서 바로 운영하세요.',
  tuiBody: '터미널에서 규칙을 생성, 편집, 사전 검사, 적용합니다. 대시보드에는 호스트 인터페이스와 RX/TX 속도도 표시됩니다.',
  mediaTabs: ['대시보드', '규칙', '사전 검사'],
  mcpEyebrow: '읽기 전용 MCP',
  mcpTitle: 'AI에는 가시성을, 제어권은 주지 않습니다.',
  mcpBody: 'stdio 어댑터가 loopback의 로컬 데몬을 읽습니다. 구성을 쓰는 도구는 제공하지 않습니다.',
  mcpPoints: [
    { title: '전용 도구 5개', body: '상태, 규칙, 트래픽 통계, 구성 사전 검사를 확인합니다.' },
    { title: '로컬 우선 설계', body: 'stdio와 loopback으로 관리 경로를 호스트 내부에 유지합니다.' },
    { title: '읽기 전용 경계', body: 'Agent는 점검하고 검증할 수 있지만 구성을 변경할 수 없습니다.' },
  ],
  securityTitle: '더 일찍 거부하고, 나머지는 제한합니다.',
  securityBody: 'IPv4/IPv6/CIDR 정책은 전달 전에 실행되며 공유 대역폭 제한과 영구 일간·월간 쿼터가 허용된 트래픽을 제어합니다.',
  securityPoints: [
    { title: '허용 또는 거부', body: '각 규칙에서 socket peer의 IP 또는 CIDR을 비교합니다.' },
    { title: 'TCP dial 이전', body: '거부된 소스는 max_conn을 사용하지 않고 대상에 연결하지 않습니다.' },
    { title: 'UDP 세션 이전', body: '거부된 데이터그램은 세션을 할당하지 않습니다.' },
  ],
  platformTitle: '하나의 바이너리, 운영체제 기본 서비스.',
  platformBody: 'systemd, launchd 또는 Windows Service로 실행합니다.',
  finalTitle: '안정 버전 vmflow v0.3.0을 설치하세요.',
  finalBody: '재현 가능한 설치에는 v0.3.0을 고정하고 최신 안정 버전을 따르려면 --version을 생략하세요.',
  copyLabel: '명령 복사',
  copiedLabel: '복사됨',
  prereleaseNote: '포트를 열기 전에 구성, 트래픽 쿼터, 방화벽을 확인하세요.',
};

const copyByLocale: Record<string, Partial<LandingCopy>> = {
  en: english,
  zh: chinese,
  ja: japanese,
  ru: russian,
  es: spanish,
  'pt-BR': portuguese,
  ko: korean,
};

const { lang } = useData();
const locale = computed(() => {
  const current = lang.value.toLowerCase();
  if (current.startsWith('zh')) return 'zh';
  if (current.startsWith('ja')) return 'ja';
  if (current.startsWith('ru')) return 'ru';
  if (current.startsWith('es')) return 'es';
  if (current.startsWith('pt')) return 'pt-BR';
  if (current.startsWith('ko')) return 'ko';
  return 'en';
});
const copy = computed<LandingCopy>(() => ({ ...english, ...(copyByLocale[locale.value] ?? {}) }));
const docsLink = computed(() => (locale.value === 'en' ? '/guide/quick-start' : `/${locale.value}/quick-start`));
const mcpLink = computed(() => (locale.value === 'en' ? '/commands/mcp' : `/${locale.value}/mcp`));
const tuiBoundary = computed(() => {
  const boundaries: Record<string, string> = {
    en: 'Write actions require authentication and an admin token. Viewer and auth-disabled sessions are read-only.',
    zh: '写操作需要启用认证并使用 admin token；viewer 或未启用认证的会话保持只读。',
    ja: '書き込み操作には認証と admin token が必要です。viewer または認証無効のセッションは読み取り専用です。',
    ru: 'Для записи нужны включённая аутентификация и admin token. Сеансы viewer и без аутентификации доступны только для чтения.',
    es: 'Las operaciones de escritura requieren autenticación y un admin token. Las sesiones viewer o sin autenticación son de solo lectura.',
    'pt-BR': 'Operações de escrita exigem autenticação e um admin token. Sessões viewer ou sem autenticação são somente leitura.',
    ko: '쓰기 작업에는 인증과 admin token이 필요합니다. viewer 또는 인증이 비활성화된 세션은 읽기 전용입니다.',
  };
  return boundaries[locale.value] ?? boundaries.en;
});
const securityBoundary = computed(() => {
  const boundaries: Record<string, { label: string; body: string }> = {
    en: { label: 'Boundary:', body: 'Source IP policy matches the socket peer. It does not replace a cloud, host, or network firewall.' },
    zh: { label: '能力边界：', body: 'Source IP 策略匹配 socket peer，不能替代云防火墙、主机防火墙或网络防火墙。' },
    ja: { label: '境界：', body: 'Source IP ポリシーは socket peer を照合します。クラウド、ホスト、ネットワークのファイアウォールを代替しません。' },
    ru: { label: 'Граница:', body: 'Политика Source IP сопоставляет socket peer и не заменяет облачный, хостовый или сетевой межсетевой экран.' },
    es: { label: 'Límite:', body: 'La política Source IP compara el socket peer y no sustituye un firewall de nube, host o red.' },
    'pt-BR': { label: 'Limite:', body: 'A política Source IP compara o socket peer e não substitui um firewall de nuvem, host ou rede.' },
    ko: { label: '경계:', body: 'Source IP 정책은 socket peer를 비교하며 클라우드, 호스트 또는 네트워크 방화벽을 대체하지 않습니다.' },
  };
  return boundaries[locale.value] ?? boundaries.en;
});

const screens = [dashboardImage, rulesImage, precheckImage];
const activeScreen = ref(0);
const copied = ref(false);
let copiedTimer: ReturnType<typeof setTimeout> | undefined;

const installCommand =
  'curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash -s -- --version v0.3.0';

function selectScreen(index: number) {
  activeScreen.value = index;
}

function moveScreen(index: number) {
  const nextIndex = (index + screens.length) % screens.length;
  activeScreen.value = nextIndex;
  requestAnimationFrame(() => {
    document.getElementById(`vmflow-tab-${nextIndex}`)?.focus();
  });
}

async function copyInstallCommand() {
  if (typeof document === 'undefined') return;
  let success = false;
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(installCommand);
      success = true;
    } catch {
      // Fall through to the selection-based copy path.
    }
  }
  if (!success) {
    const textarea = document.createElement('textarea');
    textarea.value = installCommand;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      success = document.execCommand('copy');
    } catch {
      success = false;
    } finally {
      textarea.remove();
    }
  }
  if (!success) return;
  copied.value = true;
  if (copiedTimer) clearTimeout(copiedTimer);
  copiedTimer = setTimeout(() => {
    copied.value = false;
  }, 1800);
}
</script>

<template>
  <main class="vmflow-landing">
    <section class="vmflow-hero" aria-labelledby="vmflow-title">
      <img
        class="vmflow-hero__terminal"
        :src="dashboardImage"
        :alt="copy.mediaAlt[0]"
        width="1390"
        height="752"
        fetchpriority="high"
      />
      <div class="vmflow-shell vmflow-hero__content">
        <p class="vmflow-release"><span aria-hidden="true"></span>{{ copy.heroEyebrow }}</p>
        <h1 id="vmflow-title">vmflow</h1>
        <p class="vmflow-hero__title">{{ copy.heroTitle }}</p>
        <p class="vmflow-hero__body">{{ copy.heroBody }}</p>
        <div class="vmflow-actions">
          <a class="vmflow-button vmflow-button--primary" href="#install">{{ copy.installCta }}</a>
          <a class="vmflow-button vmflow-button--ghost" :href="docsLink">{{ copy.docsCta }}</a>
          <a
            class="vmflow-text-link"
            href="https://github.com/cloudapp3/vmflow/releases/tag/v0.3.0"
            target="_blank"
            rel="noreferrer"
          >{{ copy.releaseCta }} <span aria-hidden="true">↗</span></a>
        </div>
        <div class="vmflow-hero__meta" aria-label="Project facts">
          <span>Pure Go</span><span>Single binary</span><span>MIT</span>
        </div>
      </div>
    </section>

    <section class="vmflow-facts" aria-label="vmflow capabilities">
      <div class="vmflow-shell vmflow-facts__grid">
        <div v-for="fact in copy.facts" :key="fact.label" class="vmflow-fact">
          <strong>{{ fact.value }}</strong>
          <span>{{ fact.label }}</span>
        </div>
      </div>
    </section>

    <section class="vmflow-section vmflow-flow">
      <div class="vmflow-shell">
        <div class="vmflow-heading vmflow-heading--wide">
          <p class="vmflow-eyebrow">{{ copy.flowEyebrow }}</p>
          <h2>{{ copy.flowTitle }}</h2>
          <p>{{ copy.flowBody }}</p>
        </div>
        <ol class="vmflow-flow__steps">
          <li v-for="(step, index) in copy.flowSteps" :key="step">
            <span>{{ String(index + 1).padStart(2, '0') }}</span>
            <strong>{{ step }}</strong>
          </li>
        </ol>
      </div>
    </section>

    <section class="vmflow-section vmflow-showcase">
      <div class="vmflow-shell">
        <div class="vmflow-heading vmflow-heading--split">
          <div>
            <p class="vmflow-eyebrow">{{ copy.tuiEyebrow }}</p>
            <h2>{{ copy.tuiTitle }}</h2>
          </div>
          <p>{{ copy.tuiBody }}</p>
        </div>
        <div class="vmflow-media">
          <div class="vmflow-media__bar">
            <span class="vmflow-media__brand"><i aria-hidden="true"></i>vmflow tui</span>
            <div class="vmflow-tabs" role="tablist" :aria-label="copy.tuiEyebrow">
              <button
                v-for="(tab, index) in copy.mediaTabs"
                :key="tab"
                type="button"
                role="tab"
                :id="`vmflow-tab-${index}`"
                :aria-controls="`vmflow-panel-${index}`"
                :aria-selected="activeScreen === index"
                :tabindex="activeScreen === index ? 0 : -1"
                :class="{ 'is-active': activeScreen === index }"
                @click="selectScreen(index)"
                @keydown.left.prevent="moveScreen(index - 1)"
                @keydown.right.prevent="moveScreen(index + 1)"
                @keydown.home.prevent="moveScreen(0)"
                @keydown.end.prevent="moveScreen(screens.length - 1)"
              >{{ tab }}</button>
            </div>
          </div>
          <div class="vmflow-media__viewport">
            <div
              v-for="(screen, index) in screens"
              v-show="activeScreen === index"
              :id="`vmflow-panel-${index}`"
              :key="screen"
              class="vmflow-media__panel"
              role="tabpanel"
              :aria-labelledby="`vmflow-tab-${index}`"
            >
              <img
                :src="screen"
                :alt="copy.mediaAlt[index]"
                width="1390"
                height="752"
                loading="lazy"
              />
            </div>
          </div>
        </div>
        <p class="vmflow-media__note">{{ tuiBoundary }}</p>
      </div>
    </section>

    <section class="vmflow-section vmflow-mcp">
      <div class="vmflow-shell vmflow-mcp__grid">
        <div class="vmflow-heading">
          <p class="vmflow-eyebrow">{{ copy.mcpEyebrow }}</p>
          <h2>{{ copy.mcpTitle }}</h2>
          <p>{{ copy.mcpBody }}</p>
          <a class="vmflow-inline-link" :href="mcpLink">MCP docs <span aria-hidden="true">→</span></a>
        </div>
        <div class="vmflow-mcp__diagram" aria-label="Local read-only MCP data path">
          <div class="vmflow-mcp__node vmflow-mcp__client">
            <span>AI client</span>
            <strong>Codex / Claude Desktop</strong>
          </div>
          <div class="vmflow-mcp__connector"><span>stdio</span></div>
          <div class="vmflow-mcp__node vmflow-mcp__adapter">
            <span>viewer token</span>
            <strong>vmflow mcp</strong>
            <small>5 read-only tools</small>
          </div>
          <div class="vmflow-mcp__connector"><span>127.0.0.1</span></div>
          <div class="vmflow-mcp__node vmflow-mcp__daemon">
            <span>local daemon</span>
            <strong>vmflow runtime</strong>
          </div>
          <div class="vmflow-mcp__boundaries">
            <span class="is-allowed">status</span>
            <span class="is-allowed">rules</span>
            <span class="is-allowed">traffic</span>
            <span class="is-allowed">precheck</span>
            <span class="is-denied">no writes</span>
            <span class="is-denied">no shell</span>
            <span class="is-denied">no files</span>
          </div>
        </div>
      </div>
      <div class="vmflow-shell vmflow-point-row">
        <article v-for="(point, index) in copy.mcpPoints" :key="point.title">
          <span>{{ String(index + 1).padStart(2, '0') }}</span>
          <h3>{{ point.title }}</h3>
          <p>{{ point.body }}</p>
        </article>
      </div>
    </section>

    <section class="vmflow-section vmflow-security">
      <div class="vmflow-shell">
        <div class="vmflow-heading vmflow-heading--split">
          <div>
            <p class="vmflow-eyebrow">{{ copy.securityEyebrow }}</p>
            <h2>{{ copy.securityTitle }}</h2>
          </div>
          <p>{{ copy.securityBody }}</p>
        </div>
        <div class="vmflow-security__grid">
          <article v-for="point in copy.securityPoints" :key="point.title">
            <div class="vmflow-security__signal" aria-hidden="true"></div>
            <h3>{{ point.title }}</h3>
            <p>{{ point.body }}</p>
          </article>
        </div>
        <p class="vmflow-security__boundary">
          <strong>{{ securityBoundary.label }}</strong> {{ securityBoundary.body }}
        </p>
      </div>
    </section>

    <section class="vmflow-section vmflow-platforms">
      <div class="vmflow-shell">
        <div class="vmflow-heading vmflow-heading--wide">
          <p class="vmflow-eyebrow">{{ copy.platformEyebrow }}</p>
          <h2>{{ copy.platformTitle }}</h2>
          <p>{{ copy.platformBody }}</p>
        </div>
        <div class="vmflow-platforms__grid">
          <article>
            <span>Linux</span>
            <strong>systemd</strong>
            <code>vmflow service install</code>
          </article>
          <article>
            <span>macOS</span>
            <strong>launchd</strong>
            <code>vmflow service install</code>
          </article>
          <article>
            <span>Windows</span>
            <strong>Windows Service</strong>
            <code>vmflow.exe service install</code>
          </article>
        </div>
      </div>
    </section>

    <section id="install" class="vmflow-install">
      <div class="vmflow-shell vmflow-install__inner">
        <div>
          <p class="vmflow-eyebrow">v0.3.0</p>
          <h2>{{ copy.finalTitle }}</h2>
          <p>{{ copy.finalBody }}</p>
        </div>
        <div class="vmflow-install__command">
          <code>{{ installCommand }}</code>
          <button type="button" :aria-label="copy.copyLabel" @click="copyInstallCommand">
            <span class="vmflow-copy-icon" aria-hidden="true"></span>
            <span class="vmflow-copy-label" aria-live="polite">{{ copied ? copy.copiedLabel : copy.copyLabel }}</span>
          </button>
        </div>
        <div class="vmflow-install__links">
          <a :href="docsLink">{{ copy.docsCta }} <span aria-hidden="true">→</span></a>
          <a href="https://github.com/cloudapp3/vmflow" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
          <a href="https://github.com/cloudapp3/vmflow/releases/tag/v0.3.0" target="_blank" rel="noreferrer">Release <span aria-hidden="true">↗</span></a>
        </div>
        <p class="vmflow-install__note">{{ copy.prereleaseNote }}</p>
      </div>
    </section>
  </main>
</template>
