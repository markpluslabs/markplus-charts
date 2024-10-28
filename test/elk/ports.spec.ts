import ELK from 'elkjs';
import { describe, test } from 'vitest';

describe('elk', () => {
  test('default', async () => {
    const elk = new ELK();
    const r = await elk.layout(
      {
        id: 'root',
        children: [
          {
            id: 'A',
            width: 100,
            height: 100,
            ports: [
              {
                id: '57da7b5dfffd97e2179e06df_0',
                properties: {
                  'port.side': 'NORTH',
                },
              },
              {
                id: '57da7b5dfffd97e2179e06df_1',
                properties: {
                  'port.side': 'SOUTH',
                },
              },
            ],
            properties: {
              portConstraints: 'FIXED_ORDER',
            },
          },
        ],
      },
      { layoutOptions: { 'elk.algorithm': 'layered' } },
    );
    console.log(JSON.stringify(r, null, 2));
  });
});
