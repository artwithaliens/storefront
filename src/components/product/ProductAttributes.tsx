import { Box, Table, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import React from 'react';
import { ProductQuery } from '../../graphql';
import isBlank from '../../utils/isBlank';

type Props = {
  product: NonNullable<ProductQuery['product']>;
};

const ProductAttributes: React.FC<Props> = ({ product }) => (
  <Box mt={6}>
    <Typography gutterBottom variant="h3">
      Additional Information
    </Typography>
    <Table>
      <TableBody>
        {(product.__typename === 'SimpleProduct' || product.__typename === 'VariableProduct') && (
          <>
            {!isBlank(product.weight) && (
              <TableRow>
                <TableCell>Weight</TableCell>
                <TableCell>{product.weight} g</TableCell>
              </TableRow>
            )}
            {(!isBlank(product.length) || !isBlank(product.width) || isBlank(product.height)) && (
              <TableRow>
                <TableCell>Dimensions</TableCell>
                <TableCell>
                  {`${[product.length, product.width, product.height]
                    .filter((length) => !isBlank(length))
                    .join(' x ')} cm`}
                </TableCell>
              </TableRow>
            )}
          </>
        )}
        {(product.paPaperWeights?.nodes?.length ?? 0) > 0 && (
          <TableRow>
            <TableCell>Paper Weight</TableCell>
            <TableCell>
              {product.paPaperWeights?.nodes?.map((paPaperWeight) => paPaperWeight?.name)}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </Box>
);

export default ProductAttributes;
