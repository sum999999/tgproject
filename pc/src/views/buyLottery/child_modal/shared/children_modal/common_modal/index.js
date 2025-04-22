import algorithm11x5 from './11x5';
import algorithmdpc from './dpc';
import algorithmfc3d from './fc3d';
import algorithmklsf from './klsf';
import algorithmksan from './ksan';
import algorithmpk10 from './pk10';
import algorithmqtcp from './qtcp';
import algorithmqwc from './qwc';
import algorithmssc from './ssc';

const algorithms = [algorithm11x5, algorithmdpc, algorithmfc3d, algorithmklsf, algorithmksan, algorithmpk10, algorithmqtcp, algorithmqwc, algorithmssc];

export default function algorithm() {
  const args = Array.prototype.slice.apply(arguments);
  const id = args[0];
  const betballs = args[1] || '';
  for (let i = 0;i < algorithms.length;i++) {
    const algorithm = algorithms[i];
    if (algorithm[id]) {
      return algorithm[id](betballs)
    }
  }
}
