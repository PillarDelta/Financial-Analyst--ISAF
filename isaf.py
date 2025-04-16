import numpy as np
from scipy.optimize import minimize
from numpy.linalg import norm

class ISAF:
    def __init__(self, time_horizon=3):
        self.time_horizon = time_horizon
        self.temporal_coupling = np.exp(-0.1 * np.arange(time_horizon))
        self.framework_data = {}
        self.coupling_matrices = {}

    def set_pestel_data(self, factors, weights, probabilities, impacts):
        self.framework_data['pestel'] = (factors, weights, probabilities, impacts)

    def pestel_operator(self):
        factors, weights, probabilities, impacts = self.framework_data['pestel']
        E_impact = sum(weights[i] * probabilities[i] * impacts[i] for i in range(len(factors)))
        return E_impact

    def set_five_forces_data(self, forces, influence_matrix):
        self.framework_data['five_forces'] = (forces, influence_matrix)

    def five_forces_operator(self):
        forces, W = self.framework_data['five_forces']
        attractiveness = 1 - np.sum([forces[i] * np.sum([W[i, j] for j in range(len(forces)) if j != i]) for i in range(len(forces))]) / len(forces)
        return attractiveness

    def set_swot_data(self, internal_factors, external_factors, interaction_tensor):
        self.framework_data['swot'] = (internal_factors, external_factors, interaction_tensor)

    def swot_operator(self):
        internal, external, tensor = self.framework_data['swot']
        tensor_sum = np.sum(tensor)
        swot_effectiveness = tensor_sum / (len(internal) * len(external))
        return swot_effectiveness

    def set_bcg_data(self, market_share, growth_rate):
        self.framework_data['bcg'] = (market_share, growth_rate)

    def bcg_operator(self):
        market_share, growth_rate = self.framework_data['bcg']
        bcg_score = np.mean(market_share * growth_rate)
        return bcg_score

    def set_ansoff_data(self, strategy_success, strategy_risk):
        self.framework_data['ansoff'] = (strategy_success, strategy_risk)

    def ansoff_operator(self):
        success, risk = self.framework_data['ansoff']
        ansoff_score = np.mean(success - risk)
        return ansoff_score

    def set_blue_ocean_data(self, differentiation, cost_leadership):
        self.framework_data['blue_ocean'] = (differentiation, cost_leadership)

    def blue_ocean_operator(self):
        differentiation, cost = self.framework_data['blue_ocean']
        blue_ocean_score = np.mean(differentiation / cost)
        return blue_ocean_score

    def unified_hyperfunctional_equation(self, t):
        pestel = self.pestel_operator()
        forces = self.five_forces_operator()
        swot = self.swot_operator()
        bcg = self.bcg_operator()
        ansoff = self.ansoff_operator()
        blue_ocean = self.blue_ocean_operator()

        coupling_effect = (self.coupling_matrices.get(('pestel', 'five_forces'), 0.3) * pestel * forces +
                           self.coupling_matrices.get(('five_forces', 'swot'), 0.3) * forces * swot +
                           self.coupling_matrices.get(('swot', 'bcg'), 0.3) * swot * bcg +
                           self.coupling_matrices.get(('bcg', 'ansoff'), 0.3) * bcg * ansoff +
                           self.coupling_matrices.get(('ansoff', 'blue_ocean'), 0.3) * ansoff * blue_ocean)

        strategic_state = pestel + forces + swot + bcg + ansoff + blue_ocean + coupling_effect
        return strategic_state * self.temporal_coupling[t]

    def optimize_strategy(self):
        def objective(decisions):
            self.framework_data['five_forces'] = (decisions, self.framework_data['five_forces'][1])
            return -np.sum([self.unified_hyperfunctional_equation(t) for t in range(self.time_horizon)])

        initial_guess = np.ones(len(self.framework_data['five_forces'][0])) * 0.5
        bounds = [(0, 1)] * len(initial_guess)
        result = minimize(objective, initial_guess, bounds=bounds, method='SLSQP')

        return result.x, -result.fun

    def validate_model(self, actual_outcomes):
        predicted_outcomes = np.array([self.unified_hyperfunctional_equation(t) for t in range(self.time_horizon)])
        rmse = np.sqrt(np.mean((actual_outcomes - predicted_outcomes)**2))
        mae = np.mean(np.abs(actual_outcomes - predicted_outcomes))
        r_squared = 1 - (np.sum((actual_outcomes - predicted_outcomes)**2) / np.sum((actual_outcomes - np.mean(actual_outcomes))**2))
        return {'RMSE': rmse, 'MAE': mae, 'R_squared': r_squared}
