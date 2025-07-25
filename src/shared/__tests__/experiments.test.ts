// npx jest src/shared/__tests__/experiments.test.ts

import type { ExperimentId } from "@roo-code/types"

import { EXPERIMENT_IDS, experimentConfigsMap, experiments as Experiments } from "../experiments"

describe("experiments", () => {
	describe("POWER_STEERING", () => {
		it("is configured correctly", () => {
			expect(EXPERIMENT_IDS.POWER_STEERING).toBe("powerSteering")
			expect(experimentConfigsMap.POWER_STEERING).toMatchObject({
				enabled: false,
			})
		})
	})

	describe("isEnabled", () => {
		it("returns false when POWER_STEERING experiment is not enabled", () => {
			const experiments: Record<ExperimentId, boolean> = {
				powerSteering: false,
				marketplace: false,
				concurrentFileReads: false,
				disableCompletionCommand: false,
			}
			expect(Experiments.isEnabled(experiments, EXPERIMENT_IDS.POWER_STEERING)).toBe(false)
		})

		it("returns true when experiment POWER_STEERING is enabled", () => {
			const experiments: Record<ExperimentId, boolean> = {
				powerSteering: true,
				marketplace: false,
				concurrentFileReads: false,
				disableCompletionCommand: false,
			}
			expect(Experiments.isEnabled(experiments, EXPERIMENT_IDS.POWER_STEERING)).toBe(true)
		})

		it("returns false when experiment is not present", () => {
			const experiments: Record<ExperimentId, boolean> = {
				powerSteering: false,
				marketplace: false,
				concurrentFileReads: false,
				disableCompletionCommand: false,
			}
			expect(Experiments.isEnabled(experiments, EXPERIMENT_IDS.POWER_STEERING)).toBe(false)
		})

		it("returns false when CONCURRENT_FILE_READS experiment is not enabled", () => {
			const experiments: Record<ExperimentId, boolean> = {
				powerSteering: false,
				marketplace: false,
				concurrentFileReads: false,
				disableCompletionCommand: false,
			}
			expect(Experiments.isEnabled(experiments, EXPERIMENT_IDS.CONCURRENT_FILE_READS)).toBe(false)
		})

		it("returns true when CONCURRENT_FILE_READS experiment is enabled", () => {
			const experiments: Record<ExperimentId, boolean> = {
				powerSteering: false,
				marketplace: false,
				concurrentFileReads: true,
				disableCompletionCommand: false,
			}
			expect(Experiments.isEnabled(experiments, EXPERIMENT_IDS.CONCURRENT_FILE_READS)).toBe(true)
		})
	})
	describe("MARKETPLACE", () => {
		it("is configured correctly", () => {
			expect(EXPERIMENT_IDS.MARKETPLACE).toBe("marketplace")
			expect(experimentConfigsMap.MARKETPLACE).toMatchObject({
				enabled: false,
			})
		})
	})

	describe("isEnabled for MARKETPLACE", () => {
		it("returns false when MARKETPLACE experiment is not enabled", () => {
			const experiments: Record<ExperimentId, boolean> = {
				powerSteering: false,
				marketplace: false,
				concurrentFileReads: false,
				disableCompletionCommand: false,
			}
			expect(Experiments.isEnabled(experiments, EXPERIMENT_IDS.MARKETPLACE)).toBe(false)
		})

		it("returns true when MARKETPLACE experiment is enabled", () => {
			const experiments: Record<ExperimentId, boolean> = {
				powerSteering: false,
				marketplace: true,
				concurrentFileReads: false,
				disableCompletionCommand: false,
			}
			expect(Experiments.isEnabled(experiments, EXPERIMENT_IDS.MARKETPLACE)).toBe(true)
		})

		it("returns false when MARKETPLACE experiment is not present", () => {
			const experiments: Record<ExperimentId, boolean> = {
				powerSteering: false,
				concurrentFileReads: false,
				// marketplace missing
			} as any
			expect(Experiments.isEnabled(experiments, EXPERIMENT_IDS.MARKETPLACE)).toBe(false)
		})
	})
})
