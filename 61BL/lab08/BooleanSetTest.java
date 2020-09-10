import org.junit.Test;

import java.util.Arrays;

import static org.junit.Assert.*;

public class BooleanSetTest {

    @Test
    public void testBasics() {
        BooleanSet aSet = new BooleanSet(100);
        assertEquals(0, aSet.size());
        for (int i = 0; i < 100; i += 2) {
            aSet.add(i);
            assertTrue(aSet.contains(i));
        }
        assertEquals(50, aSet.size());

        for (int i = 0; i < 100; i += 2) {
            aSet.remove(i);
            assertFalse(aSet.contains(i));
        }
        assertTrue(aSet.isEmpty());
        assertEquals(0, aSet.size());
    }

    @Test
    public void test1() {
        BooleanSet set = new BooleanSet(100);
        set.add(1);
        set.add(1);
        set.add(2);
        assertEquals(2, set.size());
        set.add(99);
        set.add(79);
        System.out.println(Arrays.toString(set.toIntArray()));
    }
}
