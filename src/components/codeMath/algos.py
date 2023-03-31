class BernoulliBandit(Bandit):

    def __init__(self, n, probas=None):
        """
        n (int): number of arms.
        probas (list of float): probabilities of each arms.
        """
        assert probas is None or len(probas) == n
        self.n = n
        if probas is None:
            # generate random probabilities
            np.random.seed(int(time.time()))
            self.probas = [np.random.random() for _ in range(self.n)]
        else:
            self.probas = probas

        # best probability
        self.best_proba = max(self.probas)

    def generate_reward(self, i):
        # The player selected the i-th machine.
        if np.random.random() < self.probas[i]:
            return 1
        else:
            return 0
        


class ThompsonSampling(Solver):
    def __init__(self, bandit, init_a=1, init_b=1):
        """
        init_a (int): initial value of a in Beta(a, b).
        init_b (int): initial value of b in Beta(a, b).
        banidt: BernoulliBandit instance.
        """
        super(ThompsonSampling, self).__init__(bandit)

        # initialize Beta distribution parameters
        self._as = [init_a] * self.bandit.n
        self._bs = [init_b] * self.bandit.n

    def estimated_probas(self):
        """
        Returns:
            list of float: estimated probabilities of each arms.
        """
        # return Beta distribution parameters
        return [self._as[i] / (self._as[i] + self._bs[i]) 
                for i in range(self.bandit.n)]

    def run_one_step(self):
        """
        Returns:
            int: selected arm.
        """
        # sample from Beta distribution
        samples = [np.random.beta(self._as[x], self._bs[x])
                   for x in range(self.bandit.n)]
        
        # select arm with the highest sample
        i = max(range(self.bandit.n), key=lambda x: samples[x])

        # get reward
        r = self.bandit.generate_reward(i)

        # update parameters
        self._as[i] += r
        self._bs[i] += (1 - r)

        return i
