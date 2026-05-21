CREATE TABLE `_KeywordToPost` (
  `A` INTEGER NOT NULL,
  `B` INTEGER NOT NULL,

  UNIQUE INDEX `_KeywordToPost_AB_unique`(`A`, `B`),
  INDEX `_KeywordToPost_B_index`(`B`)
);

ALTER TABLE `_KeywordToPost`
ADD CONSTRAINT `_KeywordToPost_A_fkey`
FOREIGN KEY (`A`) REFERENCES `Keyword`(`id`)
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `_KeywordToPost`
ADD CONSTRAINT `_KeywordToPost_B_fkey`
FOREIGN KEY (`B`) REFERENCES `Post`(`id`)
ON DELETE CASCADE ON UPDATE CASCADE;