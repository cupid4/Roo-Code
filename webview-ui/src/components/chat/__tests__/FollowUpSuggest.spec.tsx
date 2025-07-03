import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { FollowUpSuggest } from "../FollowUpSuggest"
import { ExtensionStateContext, ExtensionStateContextType } from "@src/context/ExtensionStateContext"
import { TooltipProvider } from "@radix-ui/react-tooltip"

// Mock the translation hook
vi.mock("@src/i18n/TranslationContext", () => ({
	TranslationProvider: ({ children }: { children: React.ReactNode }) => children,
	useAppTranslation: () => ({
		t: (key: string, options?: any) => {
			if (key === "chat:followUpSuggest.countdownDisplay" && options?.count !== undefined) {
				return `${options.count}s`
			}
			if (key === "chat:followUpSuggest.autoSelectCountdown" && options?.count !== undefined) {
				return `Auto-selecting in ${options.count} seconds`
			}
			if (key === "chat:followUpSuggest.copyToInput") {
				return "Copy to input"
			}
			return key
		},
	}),
}))

// Mock the extension state
const createMockExtensionState = (overrides?: Partial<ExtensionStateContextType>): ExtensionStateContextType =>
	({
		version: "1.0.0",
		clineMessages: [],
		taskHistory: [],
		shouldShowAnnouncement: false,
		allowedCommands: [],
		soundEnabled: false,
		soundVolume: 0.5,
		ttsEnabled: false,
		ttsSpeed: 1.0,
		diffEnabled: false,
		enableCheckpoints: true,
		fuzzyMatchThreshold: 1.0,
		language: "en",
		writeDelayMs: 1000,
		browserViewportSize: "900x600",
		screenshotQuality: 75,
		terminalOutputLineLimit: 500,
		terminalShellIntegrationTimeout: 4000,
		mcpEnabled: true,
		enableMcpServerCreation: false,
		alwaysApproveResubmit: false,
		requestDelaySeconds: 5,
		currentApiConfigName: "default",
		listApiConfigMeta: [],
		mode: "code",
		customModePrompts: {},
		customSupportPrompts: {},
		experiments: {},
		enhancementApiConfigId: "",
		condensingApiConfigId: "",
		customCondensingPrompt: "",
		hasOpenedModeSelector: false,
		autoApprovalEnabled: true,
		alwaysAllowFollowupQuestions: true,
		followupAutoApproveTimeoutMs: 3000, // 3 seconds for testing
		customModes: [],
		maxOpenTabsContext: 20,
		maxWorkspaceFiles: 200,
		cwd: "",
		browserToolEnabled: true,
		telemetrySetting: "unset",
		showRooIgnoredFiles: true,
		renderContext: "sidebar",
		maxReadFileLine: -1,
		pinnedApiConfigs: {},
		didHydrateState: true,
		showWelcome: false,
		theme: {},
		mcpServers: [],
		filePaths: [],
		openedTabs: [],
		organizationAllowList: { type: "all" },
		cloudIsAuthenticated: false,
		sharingEnabled: false,
		mdmCompliant: true,
		autoCondenseContext: false,
		autoCondenseContextPercent: 50,
		setHasOpenedModeSelector: vi.fn(),
		setAlwaysAllowFollowupQuestions: vi.fn(),
		setFollowupAutoApproveTimeoutMs: vi.fn(),
		setCondensingApiConfigId: vi.fn(),
		setCustomCondensingPrompt: vi.fn(),
		setPinnedApiConfigs: vi.fn(),
		togglePinnedApiConfig: vi.fn(),
		setTerminalCompressProgressBar: vi.fn(),
		setHistoryPreviewCollapsed: vi.fn(),
		setAutoCondenseContext: vi.fn(),
		setAutoCondenseContextPercent: vi.fn(),
		...overrides,
	}) as ExtensionStateContextType

const renderWithProviders = (component: React.ReactElement, stateOverrides?: Partial<ExtensionStateContextType>) => {
	const mockState = createMockExtensionState(stateOverrides)

	return render(
		<ExtensionStateContext.Provider value={mockState}>
			<TooltipProvider>{component}</TooltipProvider>
		</ExtensionStateContext.Provider>,
	)
}

describe("FollowUpSuggest", () => {
	const mockSuggestions = [{ answer: "First suggestion" }, { answer: "Second suggestion" }]

	const mockOnSuggestionClick = vi.fn()
	const mockOnUnmount = vi.fn()

	beforeEach(() => {
		vi.clearAllMocks()
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it("should display countdown timer when auto-approval is enabled", () => {
		renderWithProviders(
			<FollowUpSuggest
				suggestions={mockSuggestions}
				onSuggestionClick={mockOnSuggestionClick}
				ts={123}
				onUnmount={mockOnUnmount}
			/>,
		)

		// Should show initial countdown (3 seconds)
		expect(screen.getByText(/3s/)).toBeInTheDocument()
	})

	it("should not display countdown timer when isAnswered is true", () => {
		renderWithProviders(
			<FollowUpSuggest
				suggestions={mockSuggestions}
				onSuggestionClick={mockOnSuggestionClick}
				ts={123}
				onUnmount={mockOnUnmount}
				isAnswered={true}
			/>,
		)

		// Should not show countdown
		expect(screen.queryByText(/\d+s/)).not.toBeInTheDocument()
	})

	it("should clear interval and call onUnmount when component unmounts", () => {
		const { unmount } = renderWithProviders(
			<FollowUpSuggest
				suggestions={mockSuggestions}
				onSuggestionClick={mockOnSuggestionClick}
				ts={123}
				onUnmount={mockOnUnmount}
			/>,
		)

		// Unmount the component
		unmount()

		// onUnmount should have been called
		expect(mockOnUnmount).toHaveBeenCalled()
	})

	it("should not show countdown when auto-approval is disabled", () => {
		renderWithProviders(
			<FollowUpSuggest
				suggestions={mockSuggestions}
				onSuggestionClick={mockOnSuggestionClick}
				ts={123}
				onUnmount={mockOnUnmount}
			/>,
			{ autoApprovalEnabled: false },
		)

		// Should not show countdown
		expect(screen.queryByText(/\d+s/)).not.toBeInTheDocument()
	})

	it("should not show countdown when alwaysAllowFollowupQuestions is false", () => {
		renderWithProviders(
			<FollowUpSuggest
				suggestions={mockSuggestions}
				onSuggestionClick={mockOnSuggestionClick}
				ts={123}
				onUnmount={mockOnUnmount}
			/>,
			{ alwaysAllowFollowupQuestions: false },
		)

		// Should not show countdown
		expect(screen.queryByText(/\d+s/)).not.toBeInTheDocument()
	})
})
